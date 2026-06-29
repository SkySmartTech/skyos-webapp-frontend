import axiosClient, { clearToken, setToken } from "./axiosClient";

/**
 * Auth — maps to backend routes/api.php (public + /auth/* group)
 *   POST /auth/login
 *   POST /auth/logout
 *   GET  /auth/me
 */

export interface ApiSidebarSubpage {
  key: string;
  name: string;
  path: string;
}

export interface ApiSidebarModule {
  key: string;
  name: string;
  icon: string | null;
  main_path: string;
  subpages: ApiSidebarSubpage[];
}

export interface ApiUser {
  id: number;
  employee_id: string;
  name: string;
  email: string | null;
  role: string;
  status: string;
  avatar_color: string | null;
  assigned_modules: string[];
  permissions: string[];
  modules: ApiSidebarModule[];
}

export interface LoginResponse {
  token: string;
  user: ApiUser;
}

export async function login(employee_id: string, password: string): Promise<LoginResponse> {
  const { data } = await axiosClient.post<LoginResponse>("/auth/login", { employee_id, password });
  setToken(data.token);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await axiosClient.post("/auth/logout");
  } finally {
    clearToken();
  }
}

export async function me(): Promise<ApiUser> {
  const { data } = await axiosClient.get<{ user: ApiUser }>("/auth/me");
  return data.user;
}

const authService = { login, logout, me };
export default authService;
