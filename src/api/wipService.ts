import axiosClient from "./axiosClient";

/**
 * WIP System module — maps 1:1 to backend app/Modules/WipSystem/routes.php
 * Base path: /m/wip-system
 */

// ---------- Types (mirrors backend JSON shapes) ----------

export interface WipDashboardLine {
  id: number;
  name: string;
  style: string | null;
  balance: number;
  upper_limit: number;
  lower_limit: number;
  u_color: string;
  m_color: string;
  l_color: string;
  is_active: boolean;
  card_color: string; // hex — already resolved server-side
  today_in: number;
  today_out: number;
}

export interface WipDashboardStatistics {
  total_lines: number;
  active_lines: number;
  today_in: number;
  today_out: number;
  today_entries: number;
}

export interface WipDashboardResponse {
  lines: WipDashboardLine[];
  statistics: WipDashboardStatistics;
}

export interface WipStyleRef {
  id: number;
  code: string;
  name: string;
}

export interface WipLine {
  id: number;
  name: string;
  current_style_id: number | null;
  style: WipStyleRef | null;
  upper_limit: number;
  lower_limit: number;
  u_color: string;
  m_color: string;
  l_color: string;
  is_active: boolean;
  balance: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface WipLinePayload {
  name: string;
  current_style_id?: number | null;
  upper_limit: number;
  lower_limit: number;
  u_color: string;
  m_color: string;
  l_color: string;
  is_active?: boolean;
}

export interface WipStyle {
  id: number;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  lines_count: number;
  lines: { id: number; name: string }[];
  created_at: string | null;
}

export interface WipStylePayload {
  code: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export interface WipDataLog {
  id: number;
  line_id: number;
  line_name: string;
  style_name: string | null;
  qty_in: number;
  qty_out: number;
  qty_balance: number;
  created_by_name: string;
  created_at: string;
}

export interface WipDataLogEntry {
  line_id: number;
  qty_in: number;
  qty_out: number;
}

export interface WipChartRow {
  line_id: number;
  name: string;
  in: number;
  out: number;
}

export interface WipRole {
  role_key: string;
  role_name: string;
  permissions: string[];
  users_count: number;
}

export interface WipRolePayload {
  role_key?: string; // required on create, ignored on update
  role_name: string;
  permissions: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ---------- Dashboard (live board) ----------

export const getDashboard = async (): Promise<WipDashboardResponse> => {
  const { data } = await axiosClient.get<WipDashboardResponse>("/m/wip-system/dashboard");
  return data;
};

// ---------- Lines ----------

export const getLines = async (): Promise<WipLine[]> => {
  const { data } = await axiosClient.get<{ lines: WipLine[] }>("/m/wip-system/lines");
  return data.lines;
};

export const getLine = async (id: number): Promise<WipLine> => {
  const { data } = await axiosClient.get<{ line: WipLine }>(`/m/wip-system/lines/${id}`);
  return data.line;
};

export const createLine = async (payload: WipLinePayload): Promise<WipLine> => {
  const { data } = await axiosClient.post<{ line: WipLine }>("/m/wip-system/lines", payload);
  return data.line;
};

export const updateLine = async (id: number, payload: WipLinePayload): Promise<WipLine> => {
  const { data } = await axiosClient.put<{ line: WipLine }>(`/m/wip-system/lines/${id}`, payload);
  return data.line;
};

export const deleteLine = async (id: number): Promise<void> => {
  await axiosClient.delete(`/m/wip-system/lines/${id}`);
};

export const toggleLineActive = async (id: number): Promise<WipLine> => {
  const { data } = await axiosClient.patch<{ line: WipLine }>(`/m/wip-system/lines/${id}/toggle-active`);
  return data.line;
};

export const setLineStyle = async (id: number, style_id: number | null): Promise<WipLine> => {
  const { data } = await axiosClient.patch<{ line: WipLine }>(`/m/wip-system/lines/${id}/set-style`, { style_id });
  return data.line;
};

// ---------- Styles ----------

export const getStyles = async (): Promise<WipStyle[]> => {
  const { data } = await axiosClient.get<{ styles: WipStyle[] }>("/m/wip-system/styles");
  return data.styles;
};

export const getActiveStyles = async (): Promise<WipStyleRef[]> => {
  const { data } = await axiosClient.get<{ styles: WipStyleRef[] }>("/m/wip-system/styles/active");
  return data.styles;
};

export const createStyle = async (payload: WipStylePayload): Promise<WipStyle> => {
  const { data } = await axiosClient.post<{ style: WipStyle }>("/m/wip-system/styles", payload);
  return data.style;
};

export const updateStyle = async (id: number, payload: WipStylePayload): Promise<WipStyle> => {
  const { data } = await axiosClient.put<{ style: WipStyle }>(`/m/wip-system/styles/${id}`, payload);
  return data.style;
};

export const deleteStyle = async (id: number): Promise<void> => {
  await axiosClient.delete(`/m/wip-system/styles/${id}`);
};

// ---------- Data logs (Inventory In/Out + Reports) ----------

export interface DataLogFilters {
  line_id?: number;
  start_date?: string;
  end_date?: string;
  per_page?: number;
  page?: number;
}

export const getDataLogs = async (filters: DataLogFilters = {}): Promise<PaginatedResponse<WipDataLog>> => {
  const { data } = await axiosClient.get<PaginatedResponse<WipDataLog>>("/m/wip-system/data-logs", { params: filters });
  return data;
};

export const getChartData = async (filters: Omit<DataLogFilters, "per_page" | "page"> = {}): Promise<WipChartRow[]> => {
  const { data } = await axiosClient.get<{ chart_data: WipChartRow[] }>("/m/wip-system/data-logs/chart", { params: filters });
  return data.chart_data;
};

/** Triggers a CSV download (streamed by the backend). */
export const exportDataLogs = async (filters: Omit<DataLogFilters, "per_page" | "page"> = {}): Promise<Blob> => {
  const { data } = await axiosClient.get<Blob>("/m/wip-system/data-logs/export", {
    params: filters,
    responseType: "blob",
  });
  return data;
};

export const createDataLogEntries = async (entries: WipDataLogEntry[]): Promise<{ message: string; logs: WipDataLog[] }> => {
  const { data } = await axiosClient.post<{ message: string; logs: WipDataLog[] }>("/m/wip-system/data-logs", { entries });
  return data;
};

// ---------- Roles (module-level custom roles) ----------

export const getRoles = async (): Promise<WipRole[]> => {
  const { data } = await axiosClient.get<{ roles: WipRole[] }>("/m/wip-system/roles");
  return data.roles;
};

export const getRolesPermissionsCatalog = async (): Promise<string[]> => {
  const { data } = await axiosClient.get<{ permissions: string[] }>("/m/wip-system/roles/permissions-catalog");
  return data.permissions;
};

export const createRole = async (payload: WipRolePayload): Promise<WipRole> => {
  const { data } = await axiosClient.post<{ role: WipRole }>("/m/wip-system/roles", payload);
  return data.role;
};

export const updateRole = async (roleKey: string, payload: WipRolePayload): Promise<WipRole> => {
  const { data } = await axiosClient.put<{ role: WipRole }>(`/m/wip-system/roles/${roleKey}`, payload);
  return data.role;
};

export const deleteRole = async (roleKey: string): Promise<void> => {
  await axiosClient.delete(`/m/wip-system/roles/${roleKey}`);
};

const wipService = {
  getDashboard,
  getLines,
  getLine,
  createLine,
  updateLine,
  deleteLine,
  toggleLineActive,
  setLineStyle,
  getStyles,
  getActiveStyles,
  createStyle,
  updateStyle,
  deleteStyle,
  getDataLogs,
  getChartData,
  exportDataLogs,
  createDataLogEntries,
  getRoles,
  getRolesPermissionsCatalog,
  createRole,
  updateRole,
  deleteRole,
};

export default wipService;
