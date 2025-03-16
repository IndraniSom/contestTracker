"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>; // ✅ Add function to fetch user manually
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (error) {
      console.error("User not logged in");
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser(); // ✅ Fetch user on mount
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
