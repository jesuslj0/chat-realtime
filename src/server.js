import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const server = createServer(app); //Servidor

const io = new Server(server, { //Conexión con websockets
    cors: {
        origin: "*",
    },
});


// Manejo de conexión de usuarios
io.on("connection", (socket) => {
    console.log("🟢 Usuario conectado:", socket.id);

    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`🛎️ Usuario ${socket.id} se unió a la sala ${room}`);
    });

    socket.on("sendMessage", (data) => {
        io.to(data.room).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Usuario desconectado:", socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
