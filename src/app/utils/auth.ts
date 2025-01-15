import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h'; // Token expiry time

interface UserRequest extends Request {
    user?: { id: number };
}

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: number): string => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};


// Function to check user login during authentication
export const checkUserCredentials = async (
    enteredPassword: string,
    storedHashedPassword: string,
    userId: number
): Promise<{ success: boolean; token?: string; message?: string }> => {
    const isPasswordValid = await comparePasswords(enteredPassword, storedHashedPassword);

    if (!isPasswordValid) {
        return { success: false, message: 'Invalid credentials' };
    }

    const token = generateToken(userId);
    return { success: true, token };
};
