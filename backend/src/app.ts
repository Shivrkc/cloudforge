import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";

import healthRoutes from "./routes/health.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

export default app;