import axiosClient from "./axiosClient";

/**
 * Core User Management — maps 1:1 to backend
 * routes/api.php — /api/users and /api/audit-logs
 */

// ---------- Types ----------

export interface ApiUser {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "super_user" | "user";
  status: "active" | "pending" | "disabled";
  avatar_color: string | null;
  assigned_modules: { key: string; role: string | null }[];
  last_login_at: string | null;
}

export interface CreateUserPayload {
  employee_id: string;
  name: string;
  email: string;
  password: string;
  sky_role: string;
  status?: string;
  avatar_color?: string;
  assigned_modules?: { key: string; role?: string | null }[];
}

export interface UpdateUserPayload {
  employee_id?: string;
  name?: string;
  email?: string;
  password?: string;
  sky_role?: string;
  status?: string;
  avatar_color?: string;
  assigned_modules?: { key: string; role?: string | null }[];
}

export interface AuditLogUser {
  id: number;
  name: string;
  employee_id: string;
}

export interface AuditLogEntry {
  id: number;
  user_id: number | null;
  action: string;
  target_type: string | null;
  target_id: number | null;
  target_label: string | null;
  payload: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user: AuditLogUser | null;
}

// ---------- Users ----------

export const getUsers = async (): Promise<ApiUser[]> => {
  const { data } = await axiosClient.get<{ users: ApiUser[] }>("/users");
  return data.users;
};

export const createUser = async (payload: CreateUserPayload): Promise<ApiUser> => {
  const { data } = await axiosClient.post<{ user: ApiUser }>("/users", payload);
  return data.user;
};

export const updateUser = async (id: number, payload: UpdateUserPayload): Promise<ApiUser> => {
  const { data } = await axiosClient.put<{ user: ApiUser }>(`/users/${id}`, payload);
  return data.user;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axiosClient.delete(`/users/${id}`);
};

// ---------- Audit Logs ----------

export const getAuditLogs = async (perPage = 50): Promise<AuditLogEntry[]> => {
  const { data } = await axiosClient.get<{ data: AuditLogEntry[] }>("/audit-logs", {
    params: { per_page: perPage },
  });
  return data.data;
};

const userService = { getUsers, createUser, updateUser, deleteUser, getAuditLogs };
export default userService;
