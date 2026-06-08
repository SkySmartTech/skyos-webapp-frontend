import React, { createContext, useState, useContext, type ReactNode } from 'react';

export type UserRole = 'Super User' | 'user' | 'Super admin' | 'admin';

export interface User {
  employeeId: string;
  role:        UserRole;
  name:        string;
  // editable profile fields
  fullName?:   string;
  email?:      string;
  phone?:      string;
  address?:    string;
  avatar?:     string; // base64 data-URL
}

interface AuthContextType {
  user:          User | null;
  isAuthenticated: boolean;
  login:         (employeeId: string, role: UserRole, name: string) => void;
  logout:        () => void;
  updateProfile: (data: Partial<Pick<User, 'fullName' | 'email' | 'phone' | 'address' | 'avatar'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function SkyAuth({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (employeeId: string, role: UserRole, name: string) => {
    setUser({ employeeId, role, name });
  };

  const logout = () => setUser(null);

  const updateProfile = (data: Partial<Pick<User, 'fullName' | 'email' | 'phone' | 'address' | 'avatar'>>) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within SkyAuth');
  return ctx;
};
