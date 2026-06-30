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
  engagedMechanics: { epf: string; name: string; contact: string; duration: string }[];
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

export const getBreakdowns = async (): Promise<BreakdownWorkOrder[]> => {
  const { data } = await axiosClient.get<{ breakdowns: BreakdownWorkOrder[] }>('/m/work-orders/breakdowns');
  return data.breakdowns;
};

export const createBreakdown = async (payload: BreakdownPayload): Promise<BreakdownWorkOrder> => {
  const { data } = await axiosClient.post<{ breakdown: BreakdownWorkOrder }>('/m/work-orders/breakdowns', payload);
  return data.breakdown;
};
