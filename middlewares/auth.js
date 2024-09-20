
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    
    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(403).json({ error: 'Token format invalid. Expected "Bearer <token>"' });
    }

    const jwtToken = tokenParts[1];

    
    jwt.verify(jwtToken, 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }

        
        req.user = user;
        next();
    });
};
