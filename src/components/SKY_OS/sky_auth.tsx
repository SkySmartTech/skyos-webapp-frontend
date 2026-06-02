import React, { createContext, useState, useContext, type ReactNode,  } from 'react';

// Define the roles available in your system
export type UserRole = 'Super User' | 'user' | 'Super admin' | 'admin';

// Define what a User looks like
export interface User {
  employeeId: string;
  role: UserRole;
  name: string;
}

// Define the functions and data our Auth Context will provide
interface AuthContextType {
  user: User | null;
  login: (employeeId: string, role: UserRole, name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The Provider Component (Wraps your app)
export default function SkyAuth({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // The login function updates our state
  const login = (employeeId: string, role: UserRole, name: string) => {
    setUser({ employeeId, role, name });
    console.log(`User ${employeeId} logged in as ${role}`);
    // Optional: You could save the user to localStorage here so they stay logged in after a refresh
  };

  // The logout function clears the state
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// A handy custom hook so other components can easily access auth data
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a SkyAuth provider');
  }
  return context;
};