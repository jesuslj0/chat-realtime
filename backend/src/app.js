import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

//Aplicacion Express
const app = express();

app.use(cors());
app.use(express.json());

//Rutas
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

export default app;