import prisma from "../lib/prisma";
import { deleteDockerImage } from "./docker.service";

export interface CreateProjectInput {
  name: string;
  description?: string;
  repositoryName?: string;
  repositoryUrl?: string;
  branch?: string;
  status?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  repositoryName?: string;
  repositoryUrl?: string;
  branch?: string;
  status?: string;
}

export const createProject = async (userId: string, data: CreateProjectInput) => {
  return await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      repositoryName: data.repositoryName,
      repositoryUrl: data.repositoryUrl,
      branch: data.branch ?? "main",
      status: data.status ?? "idle",
      userId,
    },
  });
};

export const getUserProjects = async (userId: string) => {
  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { deployments: true },
      },
      deployments: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          status: true,
          branch: true,
          commitSha: true,
          commitMsg: true,
          imageTag: true,
          createdAt: true,
          completedAt: true,
        },
      },
    },
  });

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    repositoryName: project.repositoryName,
    repositoryUrl: project.repositoryUrl,
    branch: project.branch,
    status: project.status,
    userId: project.userId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    deploymentsCount: project._count.deployments,
    latestDeployment: project.deployments[0] || null,
  }));
};

export const getUserProjectById = async (id: string, userId: string) => {
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      _count: {
        select: { deployments: true },
      },
      deployments: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          status: true,
          branch: true,
          commitSha: true,
          commitMsg: true,
          imageTag: true,
          createdAt: true,
          completedAt: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    repositoryName: project.repositoryName,
    repositoryUrl: project.repositoryUrl,
    branch: project.branch,
    status: project.status,
    userId: project.userId,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    deploymentsCount: project._count.deployments,
    latestDeployment: project.deployments[0] || null,
  };
};

export const updateUserProject = async (
  id: string,
  userId: string,
  data: UpdateProjectInput
) => {
  const project = await prisma.project.findFirst({
    where: { id, userId },
  });

  if (!project) {
    return null;
  }

  return await prisma.project.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.repositoryName !== undefined && { repositoryName: data.repositoryName }),
      ...(data.repositoryUrl !== undefined && { repositoryUrl: data.repositoryUrl }),
      ...(data.branch !== undefined && { branch: data.branch }),
      ...(data.status !== undefined && { status: data.status }),
    },
  });
};

export const deleteUserProject = async (id: string, userId: string) => {
  const project = await prisma.project.findFirst({
    where: { id, userId },
    include: {
      deployments: {
        where: {
          imageTag: { not: null },
        },
        select: { imageTag: true },
      },
    },
  });

  if (!project) {
    return null;
  }

  // Prune any generated local Docker images for this project's deployments
  for (const dep of project.deployments) {
    if (dep.imageTag) {
      await deleteDockerImage(dep.imageTag).catch((err) => {
        console.warn(`[ProjectService] Could not prune image ${dep.imageTag} during project deletion:`, err);
      });
    }
  }

  return await prisma.project.delete({
    where: { id },
  });
};