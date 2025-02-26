import Message from '../models/Message.js';

// Obtener historial de mensajes de una sala
export const getMessages = async (req, res) => {
    try {
        const { room } = req.params;
        const messages = await Message.find({ room }).populate('sender', 'name email'); // Trae los mensajes de la sala

        res.json({ messages });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los mensajes' });
    }
};

// Guardar un mensaje en la base de datos
export const sendMessage = async (req, res) => {
    try {
        const { content, room } = req.body;
        const sender = req.user.id; // El usuario autenticado

        const message = new Message({ sender, content, room });
        await message.save();

        res.status(201).json({ message });
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar el mensaje' });
    }
};
