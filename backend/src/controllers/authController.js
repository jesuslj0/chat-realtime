import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
        res.status(400).json({ error: "Error al crear usuario" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign({
         id: user._id 
        }, process.env.JWT_SECRET, 
        { 
            expiresIn: "1h" 
        });

    res.json({ token, user: { id: user._id, name: user.name } });
};
