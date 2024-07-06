import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "./src/db/index";
import { sessions, users } from "./src/db/schema";
import 'dotenv/config'

const JWT_SECRET =process.env.SECRET;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.sendStatus(401); 
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403); 
    }
    req.user = user;
    next();
  });
};

export const createSession = async (userId: string) => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); 

    try {
        const result = await db.insert(sessions).values({
            userId: userId,
            expiresAt: expiresAt,
            id: userId
        });

        return result.id;
    } catch (error) {
        console.error("Failed to create session:", error);
        throw error;
    }
};
