import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import githubRoutes from "./routes/github.routes";
import healthRoutes from "./routes/health.routes";
import deploymentRoutes from "./routes/deployment.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/deployments", deploymentRoutes);

export default app;