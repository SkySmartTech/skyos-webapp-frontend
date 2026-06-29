import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import authService, { type ApiSidebarModule, type ApiUser } from '../../api/authService';
import { getToken } from '../../api/axiosClient';

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
  // populated from /auth/me — drives module access + sidebar
  permissions?:     string[];
  assignedModules?: string[];
  modules?:         ApiSidebarModule[];
}

interface AuthContextType {
  user:          User | null;
  isAuthenticated: boolean;
  isLoading:     boolean;
  loginError:    string | null;
  login:         (employeeId: string, password: string) => Promise<void>;
  logout:        () => void;
  updateProfile: (data: Partial<Pick<User, 'fullName' | 'email' | 'phone' | 'address' | 'avatar'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Backend's snake_case sky_role -> the display-friendly UserRole used across the UI.
function mapApiRole(skyRole: string): UserRole {
  if (skyRole === 'super_admin') return 'Super admin';
  if (skyRole === 'admin') return 'admin';
  if (skyRole === 'super_user') return 'Super User';
  return 'user';
}

function fromApiUser(apiUser: ApiUser): User {
  return {
    employeeId:      apiUser.employee_id,
    role:             mapApiRole(apiUser.role),
    name:             apiUser.name,
    email:            apiUser.email ?? undefined,
    permissions:      apiUser.permissions,
    assignedModules:  apiUser.assigned_modules,
    modules:          apiUser.modules,
  };
}

export default function SkyAuth({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Rehydrate the session on first load if a token is already stored.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!getToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const apiUser = await authService.me();
        if (!cancelled) setUser(fromApiUser(apiUser));
      } catch {
        // Invalid/expired token — axiosClient interceptor already cleared it.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // The axios interceptor fires this when any request comes back 401.
  useEffect(() => {
    const handler = () => setUser(null);
    window.addEventListener('skyos:unauthorized', handler);
    return () => window.removeEventListener('skyos:unauthorized', handler);
  }, []);

  const login = async (employeeId: string, password: string) => {
    setLoginError(null);
    try {
      const { user: apiUser } = await authService.login(employeeId, password);
      setUser(fromApiUser(apiUser));
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
          ?.response?.data?.errors?.employee_id?.[0]
        ?? (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Invalid Employee ID or Password.';
      setLoginError(message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    void authService.logout();
  };

  const updateProfile = (data: Partial<Pick<User, 'fullName' | 'email' | 'phone' | 'address' | 'avatar'>>) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isAuthenticated: !!user, isLoading, loginError }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within SkyAuth');
  return ctx;
};
