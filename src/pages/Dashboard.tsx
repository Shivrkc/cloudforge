import { useState, useEffect, FormEvent, useRef } from 'react';
import { 
  Plus, Search, Github, GitBranch, CheckCircle2, 
  AlertTriangle, RefreshCw, Database, Key, Trash, 
  ExternalLink, ShieldCheck, Activity, Layers, Server, 
  Clock, TrendingUp, Cpu
} from 'lucide-react';
import { Project, Deployment, Repository } from '../types';
import { MOCK_PROJECTS, MOCK_DEPLOYMENTS, MOCK_REPOSITORIES, SIMULATED_BUILD_STEPS } from '../data/mockData';

export default function Dashboard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [deployments, setDeployments] = useState<Deployment[]>(MOCK_DEPLOYMENTS);
  const [repos] = useState<Repository[]>(MOCK_REPOSITORIES);
  const [activeTab, setActiveTab] = useState<'overview' | 'deployments' | 'databases' | 'env-vars'>('overview');
  
  // Connect Repo Modal States
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [searchRepoQuery, setSearchRepoQuery] = useState('');
  const [isBuildingNewProject, setIsBuildingNewProject] = useState(false);
  const [newProjectLogs, setNewProjectLogs] = useState<string[]>([]);
  const [buildingProgress, setBuildingProgress] = useState(0);
  const [activeBuildingRepo, setActiveBuildingRepo] = useState<Repository | null>(null);

  // Database Tab States
  const [databases, setDatabases] = useState<Array<{ id: string; name: string; status: 'active' | 'provisioning'; url: string; size: string }>>([
    { id: 'db1', name: 'nexus-postgres-main', status: 'active', url: 'postgresql://cf_user:••••••••@sea-edge.cloudforge.db:5432/nexus', size: '142 MB' }
  ]);
  const [isProvisioningDb, setIsProvisioningDb] = useState(false);
  const [newDbName, setNewDbName] = useState('');

  // Env Var Tab States
  const [envVars, setEnvVars] = useState<Array<{ id: string; key: string; value: string; project: string }>>([
    { id: 'ev1', key: 'DATABASE_URL', value: 'postgresql://cf_user:••••••••@sea-edge.cloudforge.db', project: 'nexus-analytics-dashboard' },
    { id: 'ev2', key: 'STRIPE_SECRET_KEY', value: 'sk_live_51M••••••••••••', project: 'ecommerce-payment-service' }
  ]);
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvValue, setNewEnvValue] = useState('');
  const [newEnvProject, setNewEnvProject] = useState(MOCK_PROJECTS[0]?.name || 'nexus-analytics-dashboard');

  // Search filter
  const [searchProjectQuery, setSearchProjectQuery] = useState('');

  // Subtle High-Altitude Sky Background Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const cloudCount = 32;
    interface CloudPuff {
      x: number;
      y: number;
      z: number;
      radius: number;
      opacity: number;
      driftSpeed: number;
    }

    const clouds: CloudPuff[] = Array.from({ length: cloudCount }, () => ({
      x: Math.random() * width,
      y: height * 0.1 + Math.random() * (height * 0.8),
      z: Math.random(),
      radius: 140 + Math.random() * 220,
      opacity: 0.25 + Math.random() * 0.35,
      driftSpeed: 0.15 + Math.random() * 0.25,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep Atmospheric Sky Blue Background Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.32, '#38bdf8');
      skyGrad.addColorStop(0.68, '#7dd3fc');
      skyGrad.addColorStop(0.9, '#bae6fd');
      skyGrad.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient Sunlight Radial Lighting
      const sunGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.15,
        10,
        width * 0.5,
        height * 0.15,
        width * 0.65
      );
      sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
      sunGlow.addColorStop(0.4, 'rgba(224, 242, 254, 0.3)');
      sunGlow.addColorStop(0.85, 'rgba(125, 211, 252, 0.1)');
      sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, width, height);

      // Render Soft Layered Drifting Clouds
      clouds.sort((a, b) => a.z - b.z);

      clouds.forEach((cloud) => {
        cloud.x += cloud.driftSpeed * (0.6 + cloud.z * 0.4);
        if (cloud.x - cloud.radius > width) {
          cloud.x = -cloud.radius;
          cloud.y = height * 0.1 + Math.random() * (height * 0.8);
        }

        const scale = 0.5 + cloud.z * 0.8;
        const currentRadius = cloud.radius * scale;
        const currentOpacity = cloud.opacity;

        const cloudGlow = ctx.createRadialGradient(
          cloud.x - currentRadius * 0.2,
          cloud.y - currentRadius * 0.25,
          currentRadius * 0.05,
          cloud.x,
          cloud.y,
          currentRadius
        );

        cloudGlow.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.95})`);
        cloudGlow.addColorStop(0.5, `rgba(248, 250, 252, ${currentOpacity * 0.75})`);
        cloudGlow.addColorStop(0.85, `rgba(226, 232, 240, ${currentOpacity * 0.2})`);
        cloudGlow.addColorStop(1, 'rgba(203, 213, 225, 0)');

        ctx.beginPath();
        ctx.fillStyle = cloudGlow;
        ctx.arc(cloud.x, cloud.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle mock repo connection & building simulation
  const handleConnectRepo = (repo: Repository) => {
    setActiveBuildingRepo(repo);
    setIsBuildingNewProject(true);
    setBuildingProgress(0);
    setNewProjectLogs([`[14:40:01] Preparing secure Sandbox runner...`]);
  };

  useEffect(() => {
    if (!isBuildingNewProject || !activeBuildingRepo) return;

    const totalSteps = SIMULATED_BUILD_STEPS.length;
    let step = 0;

    const interval = setInterval(() => {
      if (step < totalSteps) {
        const log = SIMULATED_BUILD_STEPS[step];
        setNewProjectLogs(prev => [...prev, `[${log.timestamp}] ${log.message}`]);
        setBuildingProgress(Math.min(Math.floor(((step + 1) / totalSteps) * 100), 100));
        step++;
      } else {
        clearInterval(interval);
        
        const newProjId = `p-${Date.now()}`;
        const newProjName = activeBuildingRepo.name;
        
        const newProjectObj: Project = {
          id: newProjId,
          name: newProjName,
          repo: `${activeBuildingRepo.owner}/${activeBuildingRepo.name}`,
          owner: activeBuildingRepo.owner,
          status: 'ready',
          url: `https://${newProjName}.cloudforge.app`,
          updatedAt: 'Just now',
          deploymentsCount: 1
        };

        const newDeploymentObj: Deployment = {
          id: `d-${Date.now()}`,
          projectName: newProjName,
          status: 'ready',
          branch: activeBuildingRepo.branch,
          commitMsg: 'initial cloudforge import deploy',
          commitHash: 'cf7b92a',
          deployedAt: 'Just now',
          url: `https://${newProjName}-cf7b92a.cloudforge.app`,
          environment: 'production'
        };

        setProjects(prev => [newProjectObj, ...prev]);
        setDeployments(prev => [newDeploymentObj, ...prev]);
        
        setTimeout(() => {
          setIsBuildingNewProject(false);
          setIsConnectModalOpen(false);
          setActiveBuildingRepo(null);
          setNewProjectLogs([]);
          setBuildingProgress(0);
        }, 1500);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [isBuildingNewProject, activeBuildingRepo]);

  // Handle provisioning DB simulation
  const handleProvisionDb = (e: FormEvent) => {
    e.preventDefault();
    if (!newDbName.trim()) return;

    setIsProvisioningDb(true);
    const dbNameClean = newDbName.toLowerCase().replace(/[^a-z0-9-_]/g, '');

    setTimeout(() => {
      const newDb = {
        id: `db-${Date.now()}`,
        name: dbNameClean,
        status: 'active' as const,
        url: `postgresql://cf_owner:••••••••@sea-postgres.cloudforge.db:5432/${dbNameClean}`,
        size: '12 KB'
      };
      setDatabases(prev => [...prev, newDb]);
      setIsProvisioningDb(false);
      setNewDbName('');
    }, 3000);
  };

  // Handle adding Environment Variable
  const handleAddEnvVar = (e: FormEvent) => {
    e.preventDefault();
    if (!newEnvKey.trim() || !newEnvValue.trim()) return;

    const newVar = {
      id: `ev-${Date.now()}`,
      key: newEnvKey.toUpperCase().replace(/[^A-Z0-9_]/g, ''),
      value: newEnvValue,
      project: newEnvProject
    };

    setEnvVars(prev => [...prev, newVar]);
    setNewEnvKey('');
    setNewEnvValue('');
  };

  const handleDeleteEnvVar = (id: string) => {
    setEnvVars(prev => prev.filter(ev => ev.id !== id));
  };

  // Filter projects list
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
    p.repo.toLowerCase().includes(searchProjectQuery.toLowerCase())
  );

  const totalDeployments = deployments.length;
  const activeProjectsCount = projects.length;

  return (
    <div id="dashboard-workspace" className="min-h-screen flex flex-col relative overflow-x-hidden font-sans selection:bg-sky-200">
      
      {/* Background Animated Sky Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Main Container - Padded below Top Navigation Header */}
      <div className="pt-24 sm:pt-28 pb-16 flex-1 flex flex-col relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Workspace Sub-Header Glass Panel */}
        <section className="backdrop-blur-2xl bg-white/60 hover:bg-white/65 border border-white/90 rounded-3xl p-6 shadow-xl shadow-sky-950/10 transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Workspace Identity */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-blue-600/30">
                DM
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">dev-master</h1>
                  <span className="text-[11px] bg-blue-100/90 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold shadow-2xs">
                    Hobby Plan
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-semibold">Personal Developer Workspace • Cloud Deployment Engine</p>
              </div>
            </div>

            {/* Main Workspace Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsConnectModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 flex items-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Connect Repository
              </button>
            </div>

          </div>

          {/* SaaS Navigation Tabs */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center space-x-2 sm:space-x-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('deployments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'deployments'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Deployments
            </button>
            <button
              onClick={() => setActiveTab('databases')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'databases'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Databases
            </button>
            <button
              onClick={() => setActiveTab('env-vars')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'env-vars'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              Environment Variables
            </button>
          </div>
        </section>

        {/* Tab Content Areas */}
        {activeTab === 'overview' && (
          <div className="space-y-6 motion-safe:animate-fade-in-up">
            
            {/* Analytics Statistics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="backdrop-blur-xl bg-white/60 border border-white/90 rounded-2xl p-4 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Server className="w-3.5 h-3.5 text-blue-600" /> Active Projects
                </span>
                <p className="text-2xl font-extrabold text-slate-900">{activeProjectsCount}</p>
              </div>

              <div className="backdrop-blur-xl bg-white/60 border border-white/90 rounded-2xl p-4 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-blue-600" /> Total Deploys
                </span>
                <p className="text-2xl font-extrabold text-slate-900">{totalDeployments}</p>
              </div>

              <div className="backdrop-blur-xl bg-white/60 border border-white/90 rounded-2xl p-4 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Success Rate
                </span>
                <p className="text-2xl font-extrabold text-slate-900">99.9%</p>
              </div>

              <div className="backdrop-blur-xl bg-white/60 border border-white/90 rounded-2xl p-4 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" /> Avg Deploy Time
                </span>
                <p className="text-2xl font-extrabold text-slate-900">14s</p>
              </div>
            </div>

            {/* Premium Command Search Bar */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search active projects or git branches..."
                value={searchProjectQuery}
                onChange={(e) => setSearchProjectQuery(e.target.value)}
                className="w-full backdrop-blur-xl bg-white/75 focus:bg-white border border-white/90 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 font-semibold placeholder:text-slate-400 outline-none transition-all shadow-2xs focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20 backdrop-blur-xl bg-white/50 border border-dashed border-slate-300 rounded-3xl p-8 space-y-3">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No projects match your search filter.</p>
                <p className="text-xs text-slate-600">Try searching for a different repo or project name.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="backdrop-blur-2xl bg-white/60 hover:bg-white/80 border border-white/90 rounded-2xl p-6 space-y-5 shadow-lg shadow-sky-950/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-extrabold text-base text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </h3>
                        {project.status === 'ready' ? (
                          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/90 border border-amber-200 text-amber-800 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Building
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                        <Github className="w-3.5 h-3.5 text-slate-800" />
                        <span className="truncate">{project.repo}</span>
                      </div>
                    </div>

                    <div className="bg-white/70 border border-white/90 p-3.5 rounded-xl space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-500">Live URL</span>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Visiting live site simulator at ${project.url}`);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-500">Uptime</span>
                        <span className="text-emerald-700 font-bold">99.99%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 font-semibold">
                      <span>Updated {project.updatedAt}</span>
                      <span className="text-slate-800 font-bold">{project.deploymentsCount} Deploys</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Activity Table Container */}
            <div className="backdrop-blur-2xl bg-white/60 border border-white/90 rounded-2xl overflow-hidden shadow-lg shadow-sky-950/5 space-y-3 p-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Recent Deployment Activity</h3>
                  <p className="text-xs text-slate-600 font-semibold">Latest commits deployed across your workspace repositories</p>
                </div>
                <button
                  onClick={() => setActiveTab('deployments')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-slate-200/70">
                {deployments.slice(0, 3).map((dep) => (
                  <div key={dep.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/40 rounded-xl px-2 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{dep.projectName}</span>
                        <span className="text-[10px] font-mono bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded font-bold">
                          {dep.branch}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 italic">"{dep.commitMsg}"</p>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <span className="text-slate-500">{dep.deployedAt}</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: DEPLOYMENTS */}
        {activeTab === 'deployments' && (
          <div className="backdrop-blur-2xl bg-white/60 border border-white/90 rounded-3xl overflow-hidden shadow-xl shadow-sky-950/10 motion-safe:animate-fade-in-up">
            <div className="px-6 py-5 border-b border-slate-200/80 bg-white/40 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Deployment History</h2>
                <p className="text-xs text-slate-600 font-semibold">Real-time status of your deployment pipeline runs</p>
              </div>
            </div>

            <div className="divide-y divide-slate-200/80">
              {deployments.map((dep) => (
                <div key={dep.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/40 transition-colors">
                  
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-extrabold text-slate-900">{dep.projectName}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        dep.environment === 'production'
                          ? 'bg-blue-100 text-blue-900 border-blue-200'
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}>
                        {dep.environment}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-semibold italic">
                      "{dep.commitMsg}"
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-semibold">
                      <span className="flex items-center gap-1"><GitBranch className="w-3.5 h-3.5 text-slate-800" /> {dep.branch}</span>
                      <span>SHA: {dep.commitHash}</span>
                      <span>Deployed {dep.deployedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {dep.status === 'ready' ? (
                      <span className="bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ready
                      </span>
                    ) : (
                      <span className="bg-amber-100/90 border border-amber-200 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" /> Compiling
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => alert(`Reviewing compiler diagnostic logs for SHA: ${dep.commitHash}`)}
                      className="text-xs border border-white/90 bg-white/80 hover:bg-white text-slate-800 font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                    >
                      View Logs
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: DATABASES */}
        {activeTab === 'databases' && (
          <div className="space-y-6 motion-safe:animate-fade-in-up">
            
            {/* Create DB Panel Form */}
            <div className="backdrop-blur-2xl bg-white/60 border border-white/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-sky-950/10">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <Database className="w-4 h-4" /> Serverless Cloud PostgreSQL
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">Provision New Database</h2>
                <p className="text-slate-700 text-xs leading-relaxed font-semibold">
                  Spin up transactional, serverless PostgreSQL clusters instantly. Databases scale computing nodes automatically.
                </p>
              </div>

              <form onSubmit={handleProvisionDb} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. app-production-db"
                  value={newDbName}
                  onChange={(e) => setNewDbName(e.target.value)}
                  className="bg-white/75 focus:bg-white border border-white/90 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-2xs focus:ring-2 focus:ring-blue-500/20 font-semibold flex-1"
                  disabled={isProvisioningDb}
                />
                <button
                  type="submit"
                  disabled={isProvisioningDb}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProvisioningDb ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Provisioning Cluster...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Launch PostgreSQL
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Active Databases List */}
            <div className="backdrop-blur-2xl bg-white/60 border border-white/90 rounded-3xl overflow-hidden shadow-xl shadow-sky-950/10">
              <div className="px-6 py-4 border-b border-slate-200/80 bg-white/40">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Workspace Databases</h3>
              </div>
              
              <div className="divide-y divide-slate-200/80">
                {databases.map((db) => (
                  <div key={db.id} className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center text-blue-600 shadow-2xs">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block text-sm font-extrabold text-slate-900">{db.name}</span>
                          <span className="block text-[11px] font-semibold text-slate-600">Region: sea-01 Edge Node</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold px-3 py-1 rounded-full">
                          {db.size} used
                        </span>
                        <span className="bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                        </span>
                      </div>
                    </div>

                    {/* Connection URI Box */}
                    <div className="bg-white/80 p-3 rounded-xl border border-white/90 flex items-center justify-between gap-4 shadow-2xs">
                      <code className="text-xs text-slate-800 font-mono truncate select-all">{db.url}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(db.url);
                          alert('Database URL copied to clipboard!');
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer flex-shrink-0"
                      >
                        Copy URI
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: ENVIRONMENT VARIABLES */}
        {activeTab === 'env-vars' && (
          <div className="space-y-6 motion-safe:animate-fade-in-up">
            
            {/* Create Env Var Form */}
            <div className="backdrop-blur-2xl bg-white/60 border border-white/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-sky-950/10">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                  <Key className="w-4 h-4" /> Secure Environment Storage
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">Configure Environment Keys</h2>
                <p className="text-slate-700 text-xs leading-relaxed font-semibold">
                  Inject parameters and secrets dynamically into your build runs securely. Keys are encrypted at-rest using AES-256.
                </p>
              </div>

              <form onSubmit={handleAddEnvVar} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-3">
                  <select
                    value={newEnvProject}
                    onChange={(e) => setNewEnvProject(e.target.value)}
                    className="bg-white/75 focus:bg-white border border-white/90 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none w-full cursor-pointer shadow-2xs"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-4">
                  <input
                    type="text"
                    required
                    placeholder="API_KEY_NAME"
                    value={newEnvKey}
                    onChange={(e) => setNewEnvKey(e.target.value)}
                    className="bg-white/75 focus:bg-white border border-white/90 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none w-full font-mono uppercase shadow-2xs"
                  />
                </div>

                <div className="md:col-span-3">
                  <input
                    type="text"
                    required
                    placeholder="secret_parameter_value"
                    value={newEnvValue}
                    onChange={(e) => setNewEnvValue(e.target.value)}
                    className="bg-white/75 focus:bg-white border border-white/90 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none w-full font-mono shadow-2xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/30 w-full flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Key
                  </button>
                </div>
              </form>
            </div>

            {/* Configured Keys Matrix */}
            <div className="backdrop-blur-2xl bg-white/60 border border-white/90 rounded-3xl overflow-hidden shadow-xl shadow-sky-950/10">
              <div className="px-6 py-4 border-b border-slate-200/80 bg-white/40">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Configured Credentials Matrix</h3>
              </div>

              <div className="divide-y divide-slate-200/80">
                {envVars.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs font-bold">
                    No credentials injected yet.
                  </div>
                ) : (
                  envVars.map((ev) => (
                    <div key={ev.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-extrabold text-blue-700 font-mono">{ev.key}</code>
                          <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-bold">
                            {ev.project}
                          </span>
                        </div>
                        <code className="text-xs text-slate-600 font-mono block select-all">{ev.value}</code>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteEnvVar(ev.id)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-xl border border-white/90 bg-white/60 hover:bg-white transition-all shadow-2xs flex items-center justify-center cursor-pointer"
                        aria-label="Delete key"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* CONNECT REPOSITORY MODAL */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center px-4">
          <div className="backdrop-blur-2xl bg-white/90 border border-white rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden transition-all motion-safe:animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200/80 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">Connect GitHub Repository</h3>
              <button
                type="button"
                onClick={() => {
                  if (!isBuildingNewProject) setIsConnectModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer text-xs"
                disabled={isBuildingNewProject}
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!isBuildingNewProject ? (
                <div className="space-y-5">
                  <p className="text-slate-700 text-xs leading-relaxed font-semibold">
                    Import and launch configurations from your existing personal accounts seamlessly.
                  </p>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search available repositories..."
                      value={searchRepoQuery}
                      onChange={(e) => setSearchRepoQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all font-semibold shadow-2xs focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* List repositories */}
                  <div className="divide-y divide-slate-200/80 border border-slate-200 rounded-2xl max-h-60 overflow-y-auto bg-white/50">
                    {repos
                      .filter(r => r.name.toLowerCase().includes(searchRepoQuery.toLowerCase()))
                      .map((repo) => (
                        <div key={repo.id} className="p-4 flex items-center justify-between hover:bg-white transition-colors">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-900 block">{repo.name}</span>
                            <span className="text-[10px] font-semibold text-slate-500">Branch: {repo.branch} • Language: {repo.language}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleConnectRepo(repo)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            Deploy
                          </button>
                        </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-blue-600 font-bold">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> COMPILING: {buildingProgress}%
                    </span>
                    <span className="text-slate-500 font-semibold">Node: Sandbox-A7</span>
                  </div>

                  {/* Loading Slider Bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                      style={{ width: `${buildingProgress}%` }}
                    ></div>
                  </div>

                  {/* Terminal Log Window */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 h-44 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-1.5 shadow-inner">
                    {newProjectLogs.map((log, lIdx) => (
                      <div
                        key={lIdx}
                        className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('Run command') ? 'text-blue-300' : 'text-slate-400'}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Embedded Animation Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    </div>
  );
}