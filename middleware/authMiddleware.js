import jwt from 'jsonwebtoken';

const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user ={id:decoded.id} ;
        next(); 
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export default authenticateToken;
