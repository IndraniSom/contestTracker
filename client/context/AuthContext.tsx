"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.warn("🚨 No token found in localStorage");
        setUser(null);
        return; // Exit early
      }
  
      console.log("✅ Token found:", token); // Debugging log
  
      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ User fetched:", res.data); // Log the user data
  
      setUser(res.data);
    } catch (error: any) {
      console.error("❌ Failed to fetch user:", error.response?.data || error.message);
      setUser(null);
    }
  };
  
  

  useEffect(() => {
    fetchUser();
  }, []); // ✅ Runs only once on mount

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
