import api from "./api";

export interface GithubStatus {
  connected: boolean;
  github: {
    username: string;
    githubUserId: string;
    scope: string;
  } | null;
}

export interface GithubRepository {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  url: string;
  cloneUrl: string;
  defaultBranch: string;
  private: boolean;
  description: string | null;
}

export interface GithubBranch {
  name: string;
  protected: boolean;
}

export const getGithubStatus = async (): Promise<GithubStatus> => {
  const response = await api.get("/github/status");
  return response.data;
};

export const getGithubConnectUrl = async (): Promise<string> => {
  const response = await api.get<{ success: boolean; url: string }>("/github/connect");
  return response.data.url;
};

export const getGithubRepositories = async (): Promise<GithubRepository[]> => {
  const response = await api.get("/github/repos");
  return response.data.repositories;
};

export const getGithubBranches = async (
  owner: string,
  repo: string
): Promise<GithubBranch[]> => {
  const response = await api.get(
    `/github/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`
  );

  return response.data.branches;
};

export const disconnectGithub = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete("/github/disconnect");
  return response.data;
};