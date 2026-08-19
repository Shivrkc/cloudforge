import prisma from "../lib/prisma";

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
  return await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getUserProjectById = async (id: string, userId: string) => {
  return await prisma.project.findFirst({
    where: {
      id,
      userId,
    },
  });
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
  });

  if (!project) {
    return null;
  }

  return await prisma.project.delete({
    where: { id },
  });
};