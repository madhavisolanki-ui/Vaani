import { Request, Response } from "express";
import { createUser, validateUser, findUserByEmail } from "../services/authService";
import jwt from "jsonwebtoken";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role, preferredLang, schoolCluster, phone, schoolName, address, grade } = req.body as {
      name?: string;
      email: string;
      phone?: string;
      schoolName?: string;
      address?: string;
      password: string;
      role?: "teacher" | "student";
      preferredLang?: "san" | "ho" | "mun";
      schoolCluster?: string;
      grade?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters long" });
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Account already exists with this email. Please login instead." });
    }

    const userRole = role === "student" ? "student" : "teacher";
    const validLang = preferredLang === "ho" || preferredLang === "mun" ? preferredLang : "san";
    const validGrade = grade || "कक्षा 1";

    const user = await createUser(
      email,
      password,
      userRole,
      name,
      validLang,
      schoolCluster,
      phone,
      schoolName,
      address,
      validGrade
    );

    const secret = process.env.JWT_SECRET || "supersecretkey123";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      secret,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        schoolName: user.schoolName,
        address: user.address,
        role: user.role,
        preferredLang: user.preferredLang,
        grade: user.grade || "कक्षा 1",
        schoolCluster: user.schoolCluster,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message || "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await validateUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const secret = process.env.JWT_SECRET || "supersecretkey123";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      secret,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        schoolName: user.schoolName,
        address: user.address,
        role: user.role,
        preferredLang: user.preferredLang,
        grade: user.grade || "कक्षा 1",
        schoolCluster: user.schoolCluster,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
}