import bcrypt from "bcryptjs";

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  schoolName?: string;
  address?: string;
  passwordHash: string;
  role: "teacher" | "student";
  preferredLang: "san" | "ho" | "mun";
  grade?: string;
  schoolCluster?: string;
  createdAt: string;
};

const users: User[] = [];

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
}

export async function createUser(
  email: string,
  password: string,
  role: "teacher" | "student",
  name?: string,
  preferredLang: "san" | "ho" | "mun" = "san",
  schoolCluster: string = "Jharkhand District",
  phone?: string,
  schoolName?: string,
  address?: string,
  grade: string = "कक्षा 1"
): Promise<User> {
  const existing = findUserByEmail(email);
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: users.length + 1,
    name: name || (role === "teacher" ? "Primary Teacher" : "Primary Student"),
    email: email.toLowerCase().trim(),
    phone: phone || "",
    schoolName: schoolName || "",
    address: address || "",
    passwordHash,
    role,
    preferredLang,
    grade: role === "student" ? (grade || "कक्षा 1") : undefined,
    schoolCluster,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  return user;
}

export async function validateUser(
  email: string,
  password: string
): Promise<User | null> {
  const user = findUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export function getAllUsers() {
  return users.map(({ passwordHash, ...rest }) => rest);
}