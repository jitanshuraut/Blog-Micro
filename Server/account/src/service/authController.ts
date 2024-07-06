import { Request, Response } from "express";
import { db } from "../db/index";
import { UsernameAndPassword, users } from "../db/schema";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import { createSession } from "../../authMiddleware";
import { eq, lt, gte, sql } from 'drizzle-orm';

const JWT_SECRET = "your_jwt_secret";

export const register = async (req: Request, res: Response) => {
  const { email, password, name }: UsernameAndPassword = req.body;
  console.log(email, password);

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const result = await db.insert(users).values({
      name: name,
      id: uuidv4(),
      email: email,
      hashedPassword: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully", userId: result });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to register user", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password }: UsernameAndPassword = req.body;
  console.log(email, password);

  try {
    // Find user in database
    const userResult = await db.select().from(users).where(sql`lower(${users.email}) = ${email}`);


    const user = userResult[0];
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // Create session
    const sessionId = await createSession(user.id);

    res.status(200).json({ message: "Login successful", token, sessionId });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to log in", error: error.message });
  }
};
