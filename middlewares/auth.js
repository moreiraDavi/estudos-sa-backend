import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso Negado' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Token malformado' });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        req.userId = decoded.id

        
    } catch (err) {
        return res.status(401).json({message: 'Token invalido'})
    }
    
    next()
}

export default auth