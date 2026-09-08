import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, RefreshCw, CheckCircle2, AlertTriangle, 
  Terminal, ShieldAlert, GitBranch, Hash, Clock
} from 'lucide-react';
import { DeploymentStatus, DeploymentLog, BackendDeployment } from '../../types';
import { getDeploymentLogs, getDeploymentById, cancelDeployment } from '../../services/deployment.service';

interface BuildLogModalProps {
  isOpen: boolean;
  deploymentId: string | null;
  projectName?: string;
  onClose: () => void;
  onDeploymentTerminal?: (deployment: BackendDeployment) => void;
}

export const BuildLogModal: React.FC<BuildLogModalProps> = ({
  isOpen,
  deploymentId,
  projectName,
  onClose,
  onDeploymentTerminal,
}) => {
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [deployment, setDeployment] = useState<BackendDeployment | null>(null);
  const [status, setStatus] = useState<DeploymentStatus>('QUEUED');
  const [isTerminal, setIsTerminal] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);

  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const lastSequenceRef = useRef<number>(0);
  const isAutoScrollRef = useRef<boolean>(true);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll logic: scroll to bottom if user hasn't manually scrolled up
  const scrollToBottom = useCallback(() => {
    if (isAutoScrollRef.current && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, []);

  const handleScroll = () => {
    if (!logContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
    // User is within 40px of bottom
    isAutoScrollRef.current = scrollHeight - (scrollTop + clientHeight) < 40;
  };

  // Poll logs and metadata
  useEffect(() => {
    if (!isOpen || !deploymentId) {
      setLogs([]);
      setDeployment(null);
      setStatus('QUEUED');
      setIsTerminal(false);
      setIsCancelling(false);
      setCancelError(null);
      setPollError(null);
      lastSequenceRef.current = 0;
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      return;
    }

    let isSubscribed = true;

    // Fetch initial deployment details
    getDeploymentById(deploymentId)
      .then((dep) => {
        if (!isSubscribed) return;
        setDeployment(dep);
        setStatus(dep.status);
        if (['BUILT', 'FAILED', 'CANCELLED'].includes(dep.status)) {
          setIsTerminal(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load initial deployment metadata:", err);
      });

    const poll = async () => {
      try {
        const result = await getDeploymentLogs(deploymentId, lastSequenceRef.current);
        if (!isSubscribed) return;

        setPollError(null);
        setStatus(result.currentStatus);

        if (result.logs && result.logs.length > 0) {
          setLogs((prev) => {
            const existingIds = new Set(prev.map((l) => l.id));
            const newLogs = result.logs.filter((l) => !existingIds.has(l.id));
            return [...prev, ...newLogs];
          });
          const highestSeq = result.logs[result.logs.length - 1].sequence;
          if (highestSeq > lastSequenceRef.current) {
            lastSequenceRef.current = highestSeq;
          }
        }

        if (result.isTerminal) {
          setIsTerminal(true);
          if (pollTimerRef.current) {
            clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
          }
          // Fetch final deployment details for exit code, duration, imageTag
          const finalDep = await getDeploymentById(deploymentId);
          if (isSubscribed) {
            setDeployment(finalDep);
            if (onDeploymentTerminal) {
              onDeploymentTerminal(finalDep);
            }
          }
        }
      } catch (err: any) {
        if (!isSubscribed) return;
        setPollError(err.response?.data?.message || err.message || "Failed to fetch build logs");
      }
    };

    // Initial immediate poll
    poll();

    // Set 1-second interval
    pollTimerRef.current = setInterval(poll, 1000);

    return () => {
      isSubscribed = false;
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [isOpen, deploymentId, onDeploymentTerminal]);

  // Scroll to bottom when logs update
  useEffect(() => {
    scrollToBottom();
  }, [logs, scrollToBottom]);

  const handleCancel = async () => {
    if (!deploymentId || isCancelling || isTerminal) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      const res = await cancelDeployment(deploymentId);
      if (res.deployment) {
        setDeployment(res.deployment);
        setStatus(res.deployment.status);
      }
      setIsTerminal(true);
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    } catch (err: any) {
      setCancelError(err.response?.data?.message || err.message || "Failed to cancel deployment.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl shadow-sky-950/30 flex flex-col max-h-[85vh] motion-safe:animate-fade-in-up">
        {/* Header */}
        <div className="p-5 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Build & Deployment Console
              </h3>
              {/* Status Badge */}
              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                  status === 'BUILT'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : status === 'FAILED'
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : status === 'CANCELLED'
                    ? 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}
              >
                {!isTerminal && <RefreshCw className="w-3 h-3 animate-spin" />}
                {status === 'BUILT' && <CheckCircle2 className="w-3 h-3" />}
                {status === 'FAILED' && <AlertTriangle className="w-3 h-3" />}
                {status}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span className="font-semibold text-slate-300">{projectName || deployment?.repositoryName || 'Deployment'}</span>
              {deployment?.branch && (
                <span className="flex items-center gap-1 font-mono text-[11px] text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded">
                  <GitBranch className="w-3 h-3" /> {deployment.branch}
                </span>
              )}
              {deployment?.commitSha && (
                <span className="flex items-center gap-0.5 font-mono text-[11px] text-slate-400">
                  <Hash className="w-3 h-3" /> {deployment.commitSha.substring(0, 7)}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isTerminal && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCancelling}
                className="text-xs text-red-400 hover:text-red-300 font-bold bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 rounded-xl px-3 py-1.5 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                Cancel Run
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Console"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metadata Banner */}
        {deployment && (
          <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-4">
              {deployment.commitMsg && (
                <span className="truncate max-w-sm text-slate-300 italic">
                  "{deployment.commitMsg}"
                </span>
              )}
              {deployment.durationMs != null && (
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" /> {Math.round(deployment.durationMs / 1000)}s
                </span>
              )}
            </div>
            {deployment.imageTag && (
              <span className="text-slate-500 truncate max-w-xs" title={deployment.imageTag}>
                Tag: {deployment.imageTag}
              </span>
            )}
          </div>
        )}

        {/* Cancel Error Alert */}
        {cancelError && (
          <div className="mx-6 mt-4 p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300 font-semibold flex items-center justify-between">
            <span>{cancelError}</span>
            <button type="button" onClick={() => setCancelError(null)} className="text-red-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Poll Error Alert */}
        {pollError && (
          <div className="mx-6 mt-4 p-2.5 bg-amber-950/40 border border-amber-800 rounded-xl text-xs text-amber-300 font-medium">
            Connection notice: {pollError}. Retrying...
          </div>
        )}

        {/* Terminal Logs View */}
        <div
          ref={logContainerRef}
          onScroll={handleScroll}
          className="p-5 bg-slate-950 font-mono text-xs text-slate-300 overflow-y-auto flex-1 min-h-[300px] max-h-[500px] space-y-1 selection:bg-blue-600 selection:text-white"
        >
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-16 text-slate-500 space-y-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
              <p className="text-xs font-semibold">Waiting for initial build output...</p>
            </div>
          ) : (
            logs.map((log) => {
              const isSystem = log.stream === 'SYSTEM';
              const isStderr = log.stream === 'STDERR';
              const isSuccess = log.line.includes('SUCCESS') || log.line.includes('built and verified');
              const isError = isStderr || log.line.includes('ERROR') || log.line.includes('Failed');

              return (
                <div
                  key={log.id}
                  className={`leading-relaxed whitespace-pre-wrap break-all ${
                    isSystem
                      ? 'text-blue-300 font-semibold'
                      : isSuccess
                      ? 'text-emerald-400 font-semibold'
                      : isError
                      ? 'text-rose-400 font-semibold'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 select-none mr-2">[{log.sequence}]</span>
                  {log.line}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                !isTerminal ? 'bg-blue-400 animate-ping' : status === 'BUILT' ? 'bg-emerald-400' : 'bg-red-400'
              }`}
            ></span>
            {!isTerminal ? 'Live stream active' : `Build finished with status: ${status}`}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            {isTerminal ? 'Close' : 'Minimize'}
          </button>
        </div>
      </div>
    </div>
  );
};
