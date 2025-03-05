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

    // Unir usuario a una sala específica
    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`🛎️ Usuario ${socket.id} se unió a la sala ${room}`);
    });

    // Manejar envío de mensajes
    socket.on("sendMessage", async (message) => {
        console.log("📩 Mensaje recibido en el servidor:", message);

        // Emitir el mensaje a todos los clientes en la misma sala (excepto al remitente)
        socket.broadcast.to(message.room).emit("receiveMessage", message);
    });

    // Manejo de desconexión de usuario
    socket.on("disconnect", () => {
        console.log("🔴 Usuario desconectado:", socket.id);
    });
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

