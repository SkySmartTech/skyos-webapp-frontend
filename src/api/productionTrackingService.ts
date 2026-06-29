import axiosClient from "./axiosClient";

/**
 * Production Tracking module — maps 1:1 to backend
 * app/Modules/ProductionTracking/routes.php
 * Base path: /m/production-tracking
 */

// ---------- Types (mirrors backend JSON shapes) ----------

export interface ProductionDayPlanSummary {
  id: number;
  team: string;
  buyer: string;
  style: string;
  gauge: string;
  smv: string;
  carder: number;
  display_wh: string;
  plan_target_pcs: number;
  per_hour_pcs: string;
}

export interface ProductionHourlyStatus {
  hour: number;
  success: number;
  rework: number;
  defect: number;
}

export interface ProductionStats {
  perf_efi: string;
  line_efi: string;
  current_hour: number;
  hourly_target: string;
  hourly_achieve: number;
  hourly_balance: number;
  today_target: number;
  today_achieve: number;
  today_balance: number;
  upto_now_target: number;
  upto_now_achieve: number;
  upto_now_balance: number;
  today_check_qty: number;
  total_defect_qty: number;
  dhu: string;
  top_defects: string[];
  hourly_status: ProductionHourlyStatus[];
}

export interface ProductionDashboardResponse {
  day_plan: ProductionDayPlanSummary | null;
  stats: ProductionStats | null;
  available_teams: string[];
}

export interface ProductionDayPlan {
  id: number;
  plan_date: string;
  team: string;
  resp_employee: string;
  buyer: string;
  style: string;
  gauge: string;
  smv: string;
  display_wh: string;
  actual_wh: string;
  plan_target_pcs: number;
  per_hour_pcs: string;
  available_carder: number;
  present_linkers: number;
  status: "active" | "inactive";
  source_file: string | null;
  created_by: number;
  created_by_name: string;
  created_at: string;
}

export interface ProductionDayPlanPayload {
  plan_date: string; // YYYY-MM-DD
  team?: string;
  resp_employee?: string;
  buyer?: string;
  style?: string;
  gauge?: string;
  smv: number;
  display_wh: string;
  actual_wh?: string;
  plan_target_pcs: number;
  per_hour_pcs: number;
  available_carder: number;
  present_linkers?: number;
  source_file?: string | null;
}

export type CheckResult = "success" | "rework" | "defect";

export interface ProductionCheckPayload {
  day_plan_id: number;
  team_no: string;
  style: string;
  color: string;
  size: string;
  check_point: string;
  hour: number;
  result: CheckResult;
  defect_type?: string | null;
}

export interface ProductionCheckSummary {
  total_check: number;
  total_success: number;
  total_rework: number;
  total_defect: number;
  by_hour: ProductionHourlyStatus[];
}

export interface ProductionCheckFilters {
  teams: string[];
  styles: string[];
  colors: string[];
  sizes: string[];
  check_points: string[];
}

export interface ProductionRole {
  id?: number;
  role_key: string;
  role_name: string;
  permissions: string[];
}

export interface ProductionRolePayload {
  name: string;
  permissions: string[];
}

// ---------- Dashboard ----------

export const getDashboard = async (team?: string): Promise<ProductionDashboardResponse> => {
  const { data } = await axiosClient.get<ProductionDashboardResponse>("/m/production-tracking/dashboard", {
    params: team ? { team } : {},
  });
  return data;
};

// ---------- Day plans ----------

export const getDayPlans = async (): Promise<ProductionDayPlan[]> => {
  const { data } = await axiosClient.get<{ plans: ProductionDayPlan[] }>("/m/production-tracking/day-plans");
  return data.plans;
};

export const createDayPlan = async (payload: ProductionDayPlanPayload): Promise<ProductionDayPlan> => {
  const { data } = await axiosClient.post<{ plan: ProductionDayPlan }>("/m/production-tracking/day-plans", payload);
  return data.plan;
};

/** Disables (or re-enables) a day plan. A disabled plan stops powering the Dashboard / QC Update immediately. */
export const toggleDayPlanStatus = async (id: number): Promise<ProductionDayPlan> => {
  const { data } = await axiosClient.patch<{ plan: ProductionDayPlan }>(`/m/production-tracking/day-plans/${id}/toggle-status`);
  return data.plan;
};

export const getDayPlan = async (id: number): Promise<ProductionDayPlan> => {
  const { data } = await axiosClient.get<{ plan: ProductionDayPlan }>(`/m/production-tracking/day-plans/${id}`);
  return data.plan;
};

// ---------- QC checks ----------

export const createCheck = async (
  payload: ProductionCheckPayload
): Promise<{ check: unknown; summary: ProductionCheckSummary }> => {
  const { data } = await axiosClient.post<{ check: unknown; summary: ProductionCheckSummary }>(
    "/m/production-tracking/checks",
    payload
  );
  return data;
};

/** Distinct Team No / Style / Color / Size / Check Point values seen so far — drives the QC Update dropdowns. */
export const getCheckFilters = async (): Promise<ProductionCheckFilters> => {
  const { data } = await axiosClient.get<ProductionCheckFilters>("/m/production-tracking/checks/filters");
  return data;
};

export const getChecksSummary = async (day_plan_id?: number, team_no?: string): Promise<ProductionCheckSummary | null> => {
  const { data } = await axiosClient.get<{ summary: ProductionCheckSummary | null }>(
    "/m/production-tracking/checks/summary",
    { params: { ...(day_plan_id ? { day_plan_id } : {}), ...(team_no ? { team_no } : {}) } }
  );
  return data.summary;
};

// ---------- Roles ----------

export const getRoles = async (): Promise<ProductionRole[]> => {
  const { data } = await axiosClient.get<{ roles: ProductionRole[] }>("/m/production-tracking/roles");
  return data.roles;
};

export const getRolesPermissionsCatalog = async (): Promise<string[]> => {
  const { data } = await axiosClient.get<{ permissions: string[] }>(
    "/m/production-tracking/roles/permissions-catalog"
  );
  return data.permissions;
};

export const createRole = async (payload: ProductionRolePayload): Promise<void> => {
  await axiosClient.post("/m/production-tracking/roles", payload);
};

export const updateRole = async (roleKey: string, payload: ProductionRolePayload): Promise<void> => {
  await axiosClient.put(`/m/production-tracking/roles/${roleKey}`, payload);
};

export const deleteRole = async (roleKey: string): Promise<void> => {
  await axiosClient.delete(`/m/production-tracking/roles/${roleKey}`);
};

const productionTrackingService = {
  getDashboard,
  getDayPlans,
  createDayPlan,
  toggleDayPlanStatus,
  getDayPlan,
  createCheck,
  getChecksSummary,
  getCheckFilters,
  getRoles,
  getRolesPermissionsCatalog,
  createRole,
  updateRole,
  deleteRole,
};

export default productionTrackingService;
