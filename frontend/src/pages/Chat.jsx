import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchMessages, saveMessage } from "../services/MessagesService.js";

const socket = io("http://localhost:4001", {
    auth: {
        token: localStorage.getItem("jwt_token") // JWT obtenido de Django
    }
});

export default function Chat() {
    const [room, setRoom] = useState("1");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const loadMessages = useCallback(async () => {
        if (!room) return;
    
        setLoading(true);
        try {
            const data = await fetchMessages(room);
            setMessages(data);
        } catch (err) {
            console.error("Error al cargar mensajes:", err);
        }
        setLoading(false);
    }, [room]);
    
    const sendMessage = async () => {
        if (message.trim() && room) {
            const newMessage = {
                content: message,
                room: room,
            };
    
            socket.emit("sendMessage", newMessage);
    
            try {
                //Guardar el mensaje en la base de datos
                await saveMessage(newMessage);

                setMessage("");

                //Cargar mensajes desde la base de datos 
                loadMessages()

            } catch (err) {
                console.error("Error guardando el mensaje:", err);
            }
        }
    }

    useEffect(() => {
        if (!room) return;

        // Unirse a la sala
        socket.emit("joinRoom", room);

        const handleNewMessage = () => {
            loadMessages()
        };

        socket.on("receiveMessage", handleNewMessage);

        return () => {
            socket.off("receiveMessage", handleNewMessage);
        };
    }, [loadMessages, room]);

    // Cargar mensajes cuando cambia la sala
    useEffect(() => {
        loadMessages();
    }, [loadMessages]);
    
    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body" style={{ height: "400px", overflowY: "auto" }}>
                    {loading && <p>Cargando mensajes...</p>}
                    {messages && messages.map((msg, index) => (
                        <p key={index} className="mb-2">
                            <strong>{msg.sender.name}:</strong> {msg.content}
                        </p>
                    ))}
                </div>
                <div className="card-footer d-flex">
                    <input 
                        type="text" 
                        className="form-control me-2" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Mensaje..." 
                    />
                    <button className="btn btn-primary" onClick={sendMessage}>Enviar</button>
                </div>
            </div>
        </div>
    );
}