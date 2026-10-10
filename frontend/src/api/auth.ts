import axios from "axios";

const API = "http://localhost:4000/api";

export async function loginApi(email: string, password: string) {
  const res = await axios.post(`${API}/auth/login`, { email, password });
  return res.data as {
    token: string;
    role: "teacher" | "student";
    user: {
      id: number;
      name: string;
      email: string;
      phone?: string;
      schoolName?: string;
      address?: string;
      role: "teacher" | "student";
      preferredLang: "san" | "ho" | "mun";
      grade?: string;
      schoolCluster?: string;
    };
  };
}

export async function registerApi(data: {
  name: string;
  email: string;
  phone?: string;
  schoolName?: string;
  address?: string;
  password: string;
  role: "teacher" | "student";
  preferredLang?: "san" | "ho" | "mun";
  grade?: string;
  schoolCluster?: string;
}) {
  const res = await axios.post(`${API}/auth/register`, data);
  return res.data as {
    token: string;
    role: "teacher" | "student";
    user: {
      id: number;
      name: string;
      email: string;
      phone?: string;
      schoolName?: string;
      address?: string;
      role: "teacher" | "student";
      preferredLang: "san" | "ho" | "mun";
      grade?: string;
      schoolCluster?: string;
    };
  };
}