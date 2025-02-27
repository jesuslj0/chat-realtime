import express from "express";
import auth from "../middleware/auth.js";
import { getMessages, sendMessage } from "../controllers/chatController.js";

const router = express.Router()

//Rutas de chat
router.get('/:room', auth, getMessages)
router.post('/send', auth, sendMessage)

export default router;