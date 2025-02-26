import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

async function auth(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]
    console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No hay token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar token
        req.user = decoded; // Agregar info del usuario al request
        next(); // Continuar con la solicitud
    } catch (error) {
        res.status(403).json({ message: 'Token inválido' });
    }
}

export default auth;