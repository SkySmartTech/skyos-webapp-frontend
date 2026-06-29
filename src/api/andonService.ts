import { phpClient } from "./axiosClient";

export interface AndonEvent {
  ID: number;
  WorkCenter: string;
  CategoryName: string;
  CategoryNo: number;
  KeyNo: number;
  Shift: string;
  Unit: string;
  FactoryCode: string;
  StartTime: { date: string };
  StopTime: { date: string };
  ServerDateTime: { date: string };
  EventState: number;
  CPM: string;
  EffectedMachines: number;
}

export interface AndonApiResponse {
  status: string;
  message: string;
  data: AndonEvent[];
}

// EventState 1 = downtime started (active/open)
// EventState 3 = downtime off (closed/completed)
export const isEventClosed = (e: AndonEvent): boolean => e.EventState === 3;
export const isEventActive  = (e: AndonEvent): boolean => e.EventState === 1;

async function sendAndonRequest(): Promise<AndonApiResponse> {
  const payload = {
    auth_key: "1234-816062",
    func_type: "funGetFilterdData",
    params: {
      tablename: "tblEventAndon",
      NoOfParameters: 2,
    "StartDate": "2026-06-20",
    "EndDate": "2026-10-19",
    },
  };

  try {
    const response = await phpClient.post<AndonApiResponse>(
      "testapi.php",
      payload,
      {
        transformResponse: [
          (raw: string) => {
            console.log("Raw API response:", raw);
            // Find the first '{' to skip any server-side prefix text
            const start = raw.indexOf("{");
            if (start === -1) {
              throw new Error(`No JSON found in response: ${raw}`);
            }
            return JSON.parse(raw.slice(start));
          },
        ],
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

function parseAndonResponse(parsed: AndonApiResponse): AndonEvent[] {
  const events = parsed?.data;

  if (Array.isArray(events) && events.length > 0) {
    return events;
  }

  return [];
}

export async function getAndonEvents(): Promise<AndonEvent[]> {
  try {
    const parsed = await sendAndonRequest();
    return parseAndonResponse(parsed);
  } catch {
    return [];
  }
}
