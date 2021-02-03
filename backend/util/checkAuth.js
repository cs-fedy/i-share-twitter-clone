const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const jwtSecret = process.env.jwtSecret;

module.exports = (context) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, jwtSecret);
                return user;
            } catch(err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error("Authorization token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided');
} 