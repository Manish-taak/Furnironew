import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './auth'; // Assuming this function verifies the JWT token

interface UserRequest extends NextApiRequest {
    user?: any; // To attach the decoded user object
}

// Middleware to check if the user is logged in
export const CheckUserLogin = (req: UserRequest, res: NextApiResponse, next: Function) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

