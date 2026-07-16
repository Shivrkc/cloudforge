import { useState, useEffect, FormEvent } from 'react';
import { 
  Plus, Search, Github, GitBranch, ArrowRight, CheckCircle2, 
  AlertTriangle, Clock, RefreshCw, Terminal, Database, Shield, 
  Cpu, Zap, Settings, Key, Trash, ExternalLink, Activity, Sparkles, User, Globe
} from 'lucide-react';
import { Project, Deployment, Repository, BuildLog } from '../types';
import { MOCK_PROJECTS, MOCK_DEPLOYMENTS, MOCK_REPOSITORIES, SIMULATED_BUILD_STEPS } from '../data/mockData';




export default function Dashboard() {
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
  const [newEnvProject, setNewEnvProject] = useState(MOCK_PROJECTS[0].name);

  // Search filter
  const [searchProjectQuery, setSearchProjectQuery] = useState('');

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
        
        // Build succeeded! Add newly created project & deployment
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
        
        // Reset states
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

  return (
    <div id="dashboard-workspace" className="min-h-screen bg-[#070709] text-gray-100 flex flex-col pt-18">
      
      {/* Upper sub-header bar dashboard */}
      <header className="border-b border-zinc-900 bg-[#09090c]/90 sticky top-18 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4">
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-950/80 border border-blue-900 flex items-center justify-center text-blue-400 font-bold font-sans">
                U
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white font-sans">dev-master</h1>
                  <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-900 px-2 py-0.5 rounded font-mono font-bold leading-none">
                    Hobby Plan
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-mono">Personal Developer Workspace</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
  <button
    type="button"
    onClick={() => setIsConnectModalOpen(true)}
    className="bg-blue-600 hover:bg-blue-500 text-white font-sans font-medium text-sm py-2.5 px-4.5 rounded-xl transition-all shadow-md shadow-blue-950 flex items-center gap-2 cursor-pointer"
  >
    <Plus className="w-4 h-4" />
    Connect Repository
  </button>
</div>

          </div>

          {/* Sub Navigation tabs */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-sans font-medium transition-colors relative cursor-pointer ${
                activeTab === 'overview' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('deployments')}
              className={`pb-3 text-sm font-sans font-medium transition-colors relative cursor-pointer ${
                activeTab === 'deployments' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Deployments
              {activeTab === 'deployments' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('databases')}
              className={`pb-3 text-sm font-sans font-medium transition-colors relative cursor-pointer ${
                activeTab === 'databases' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Databases
              {activeTab === 'databases' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('env-vars')}
              className={`pb-3 text-sm font-sans font-medium transition-colors relative cursor-pointer ${
                activeTab === 'env-vars' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Environment Variables
              {activeTab === 'env-vars' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Main dashboard view container body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Search filter input */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search active projects or git branches..."
                value={searchProjectQuery}
                onChange={(e) => setSearchProjectQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Projects list cards */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-zinc-900 rounded-2xl bg-[#09090c]/50">
                <AlertTriangle className="w-12 h-12 text-yellow-500/80 mx-auto mb-4" />
                <p className="text-sm text-gray-400 font-sans">No projects match your filter query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-brand-card border border-brand-border hover:border-zinc-800 rounded-2xl p-6 space-y-5 transition-all shadow-md group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-sans font-bold text-base text-white truncate group-hover:text-blue-400 transition-colors">
                          {project.name}
                        </h3>
                        {project.status === 'ready' ? (
                          <span className="flex h-2 w-2 relative mt-1.5 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                        ) : (
                          <span className="flex h-2 w-2 relative mt-1.5 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                        <Github className="w-3.5 h-3.5" />
                        <span className="truncate">{project.repo}</span>
                      </div>
                    </div>

                    <div className="bg-zinc-950/60 border border-zinc-900/60 p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-500">Live URL:</span>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Visiting live site simulator at ${project.url}`);
                          }}
                          className="text-blue-400 hover:underline flex items-center gap-1"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-500">Uptime Metric:</span>
                        <span className="text-green-400 font-semibold">99.99%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-900/40 text-xs text-gray-500 font-mono">
                      <span>Updated {project.updatedAt}</span>
                      <span>{project.deploymentsCount} Deploys</span>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: DEPLOYMENTS */}
        {activeTab === 'deployments' && (
          <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-xl">
            <div className="glass-header px-6 py-4 border-b border-brand-border">
              <h2 className="text-sm font-sans font-bold text-white">Recent Repository Deployments</h2>
            </div>
            
            <div className="divide-y divide-zinc-900">
              {deployments.map((dep) => (
                <div key={dep.id} className="p-5.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-zinc-950/20 transition-colors">
                  
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-sans font-bold text-white">{dep.projectName}</span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        dep.environment === 'production' 
                          ? 'bg-blue-950/50 text-blue-400 border border-blue-900/40' 
                          : 'bg-zinc-900 text-gray-400 border border-zinc-800'
                      }`}>
                        {dep.environment}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 font-mono italic">
                      "{dep.commitMsg}"
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-mono">
                      <span className="flex items-center gap-1"><GitBranch className="w-3.5 h-3.5" /> {dep.branch}</span>
                      <span>SHA: {dep.commitHash}</span>
                      <span>Deployed {dep.deployedAt}</span>
                    </div>
                  </div>

                  {/* Status column */}
                  <div className="flex items-center gap-4">
                    {dep.status === 'ready' ? (
                      <span className="bg-green-950/40 border border-green-900/60 text-green-300 text-xs font-mono px-3 py-1 rounded-full flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                      </span>
                    ) : (
                      <span className="bg-yellow-950/40 border border-yellow-900/60 text-yellow-300 text-xs font-mono px-3 py-1 rounded-full flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Compiling
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => alert(`Reviewing compiler diagnostic logs for SHA: ${dep.commitHash}`)}
                      className="text-xs border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg font-sans transition-colors"
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
          <div className="space-y-8">
            
            {/* Create DB Panel form */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                  <Database className="w-4 h-4" /> Serverless Cloud PostgreSQL
                </span>
                <h2 className="text-lg font-sans font-bold text-white">Provision New Database</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Spin up transactional, serverless PostgreSQL clusters instantly. Databases scale computing nodes down to zero when idle, saving limits.
                </p>
              </div>

              <form onSubmit={handleProvisionDb} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. app-production-db"
                  value={newDbName}
                  onChange={(e) => setNewDbName(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none flex-1 font-mono"
                  disabled={isProvisioningDb}
                />
                <button
                  type="submit"
                  disabled={isProvisioningDb}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-sans font-medium text-sm py-2.5 px-6 rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
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

            {/* Existing Database tables list */}
            <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
              <div className="glass-header px-6 py-4 border-b border-brand-border">
                <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Active Workspace Databases</h3>
              </div>
              
              <div className="divide-y divide-zinc-900">
                {databases.map((db) => (
                  <div key={db.id} className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 bg-zinc-950 rounded-lg flex items-center justify-center text-teal-400 border border-zinc-900">
                          <Database className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-white">{db.name}</span>
                          <span className="block text-[10px] font-mono text-gray-500">Region: sea-01 Edge Node</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="bg-teal-950/40 border border-teal-900/60 text-teal-300 text-xs font-mono px-3 py-1 rounded-full">
                          {db.size} used
                        </span>
                        <span className="bg-green-950/40 border border-green-900/60 text-green-300 text-xs font-mono px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      </div>
                    </div>

                    {/* DB String connection bar */}
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 flex items-center justify-between gap-4">
                      <code className="text-xs text-gray-300 font-mono truncate select-all">{db.url}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(db.url);
                          alert('Database URL copied to clipboard!');
                        }}
                        className="text-xs text-blue-400 hover:underline font-sans cursor-pointer flex-shrink-0"
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
          <div className="space-y-8">
            
            {/* Create form panel */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1">
                  <Key className="w-4 h-4" /> Secure Environment Storage
                </span>
                <h2 className="text-lg font-sans font-bold text-white font-sans">Configure Global Keys</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Inject parameters and secrets dynamically into your compiler workspace builds securely. Keys are encrypted at-rest using AES-256.
                </p>
              </div>

              <form onSubmit={handleAddEnvVar} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-3">
                  <select
                    value={newEnvProject}
                    onChange={(e) => setNewEnvProject(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none w-full cursor-pointer font-sans"
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
                    className="bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none w-full font-mono uppercase"
                  />
                </div>

                <div className="md:col-span-3">
                  <input
                    type="text"
                    required
                    placeholder="secret_parameter_value"
                    value={newEnvValue}
                    onChange={(e) => setNewEnvValue(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none w-full font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-sans font-medium text-sm py-2.5 rounded-xl transition-all shadow w-full flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Key
                  </button>
                </div>
              </form>
            </div>

            {/* Env list cards */}
            <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
              <div className="glass-header px-6 py-4 border-b border-brand-border">
                <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Configured Credentials Matrix</h3>
              </div>

              <div className="divide-y divide-zinc-900">
                {envVars.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs font-mono">
                    No credentials injected yet.
                  </div>
                ) : (
                  envVars.map((ev) => (
                    <div key={ev.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-950/10">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-bold text-purple-400 font-mono">{ev.key}</code>
                          <span className="text-[10px] bg-zinc-900 text-gray-400 border border-zinc-800 px-2 py-0.5 rounded font-sans">
                            {ev.project}
                          </span>
                        </div>
                        <code className="text-xs text-gray-500 font-mono block select-all">{ev.value}</code>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteEnvVar(ev.id)}
                        className="p-2 text-gray-500 hover:text-red-400 rounded-lg border border-transparent hover:border-zinc-800 bg-zinc-950/40 transition-all flex items-center justify-center cursor-pointer"
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

      </main>

      {/* CONNECT REPOSITORY MODAL */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
          <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-xl shadow-2xl relative overflow-hidden">
            
            {/* Modal header */}
            <div className="glass-header px-6 py-4 border-b border-brand-border flex items-center justify-between">
              <h3 className="font-sans font-bold text-base text-white">Connect GitHub Repository</h3>
              <button
                type="button"
                onClick={() => {
                  if (!isBuildingNewProject) setIsConnectModalOpen(false);
                }}
                className="text-gray-400 hover:text-white font-semibold cursor-pointer text-sm"
                disabled={isBuildingNewProject}
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!isBuildingNewProject ? (
                <div className="space-y-5">
                  <p className="text-gray-400 text-sm leading-relaxed font-sans">
                    Import and launch configurations from your existing personal accounts seamlessly.
                  </p>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search available repositories..."
                      value={searchRepoQuery}
                      onChange={(e) => setSearchRepoQuery(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  {/* List repositories */}
                  <div className="divide-y divide-zinc-900 border border-zinc-900 rounded-xl max-h-60 overflow-y-auto">
                    {repos
                      .filter(r => r.name.toLowerCase().includes(searchRepoQuery.toLowerCase()))
                      .map((repo) => (
                        <div key={repo.id} className="p-4 flex items-center justify-between hover:bg-zinc-950/40 transition-colors">
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-white font-sans block">{repo.name}</span>
                            <span className="text-[11px] font-mono text-gray-500">Branch: {repo.branch} • Language: {repo.language}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleConnectRepo(repo)}
                            className="bg-zinc-900 hover:bg-blue-600 border border-zinc-800 hover:border-blue-500 text-xs text-gray-300 hover:text-white px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-sans"
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
                    <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> COMPILING: {buildingProgress}%
                    </span>
                    <span className="text-gray-500">Node: Sandbox-A7</span>
                  </div>

                  {/* Loading slider bar */}
                  <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${buildingProgress}%` }}
                    ></div>
                  </div>

                  {/* Terminal log window */}
                  <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-900 h-44 overflow-y-auto font-mono text-[11px] text-gray-400 space-y-1.5">
                    {newProjectLogs.map((log, lIdx) => (
                      <div
                        key={lIdx}
                        className={log.includes('SUCCESS') ? 'text-green-400 font-bold' : log.includes('Run command') ? 'text-blue-300' : 'text-gray-400'}
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

    </div>
  );
}
