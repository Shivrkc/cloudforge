export type ActiveView = 'landing' | 'login' | 'signup' | 'dashboard';

export interface Repository {
  id: string;
  name: string;
  owner: string;
  branch: string;
  updatedAt: string;
  language: 'typescript' | 'react' | 'nodejs' | 'python' | 'go' | 'rust';
}

export interface Deployment {
  id: string;
  projectName: string;
  status: 'ready' | 'building' | 'failed' | 'offline';
  branch: string;
  commitMsg: string;
  commitHash: string;
  deployedAt: string;
  url: string;
  environment: 'production' | 'preview';
}

export interface BuildLog {
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

export interface Project {
  id: string;
  name: string;
  repo: string;
  owner: string;
  status: 'ready' | 'building' | 'failed';
  url: string;
  updatedAt: string;
  deploymentsCount: number;
}
