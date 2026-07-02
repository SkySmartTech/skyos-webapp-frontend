import axiosClient from "./axiosClient";

export interface BreakdownWorkOrder {
  id: number;
  wo: string;
  time: string;
  department: string;
  by: string;
  category: string;
  description: string;
  status: "New" | "Inprogress" | "Closed";
  re_open: boolean;
  machine: string;
  engagedMechanics: {
    epf: string;
    name: string;
    contact: string;
    duration: string;
  }[];
  allocatedMechanics: string[];
  eventLog: { text: string }[];
  fault_type?: string;
  fault_level?: string;
  note?: string | null;
  machine_category?: string;
  created_at?: string;
}

export interface BreakdownPayload {
  department: string;
  machine_category: string;
  machine_number: string;
  fault_type: string;
  fault_level: string;
  description: string;
  note?: string;
}

export interface BuildingMaintenancePayload {
  department: string;
  category: string;
  description: string;
  note?: string;
}

export interface WorkOrderFilters {
  category?: string;
  department?: string;
  machine_category?: string;
  fault_type?: string;
  status?: string;
  created_from?: string;
  created_to?: string;
}

const toQueryString = (filters: WorkOrderFilters = {}) =>
  Object.entries(filters)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`,
    )
    .join("&");

export const getWorkOrders = async (
  filters: WorkOrderFilters = {},
): Promise<BreakdownWorkOrder[]> => {
  const query = toQueryString(filters);
  const url = `/m/work-orders${query ? `?${query}` : ""}`;
  const { data } = await axiosClient.get<{ work_orders: BreakdownWorkOrder[] }>(
    url,
  );
  return data.work_orders;
};

export const getBreakdowns = async (): Promise<BreakdownWorkOrder[]> => {
  return getWorkOrders({ category: "BreakDown" });
};

export const getPlannedMaintenanceWorkOrders = async (
  filters: WorkOrderFilters = {},
): Promise<BreakdownWorkOrder[]> => {
  return getWorkOrders({ category: "PlannedMaintenance", ...filters });
};

export const getRedTagWorkOrders = async (
  filters: WorkOrderFilters = {},
): Promise<BreakdownWorkOrder[]> => {
  return getWorkOrders({ category: "RedTag", ...filters });
};

export const getBuildingMaintenanceWorkOrders = async (
  filters: WorkOrderFilters = {},
): Promise<BreakdownWorkOrder[]> => {
  return getWorkOrders({ category: "BuildingMaintenance", ...filters });
};

export const createBreakdown = async (
  payload: BreakdownPayload,
): Promise<BreakdownWorkOrder> => {
  const { data } = await axiosClient.post<{ breakdown: BreakdownWorkOrder }>(
    "/m/work-orders/breakdowns",
    payload,
  );
  return data.breakdown;
};

export const createBuildingMaintenance = async (
  payload: BuildingMaintenancePayload,
): Promise<BreakdownWorkOrder> => {
  const { data } = await axiosClient.post<{
    building_maintenance: BreakdownWorkOrder;
  }>("/m/work-orders/building-maintenance", payload);
  return data.building_maintenance;
};
