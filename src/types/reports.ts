// Define the exact shapes that your backend returns for each report.
export type ReportKind = "sales" | "attendees" | "checkins";

// ✏️ TODO: adjust fields to match your API responses exactly.
export interface SalesReport {
  totalRevenue: number;
  currency: string;
  items: Array<{
    ticketTypeId: string | number;
    ticketTypeName: string;
    quantity: number;
    gross: number;
  }>;
}

export interface AttendeesReport {
  total: number;
  checkedIn: number;
  rows: Array<{
    attendeeId: string | number;
    name: string;
    email?: string | null;
    checkedInAt?: string | null; // ISO
  }>;
}

export interface CheckinsReport {
  total: number;
  entries: Array<{
    at: string; // ISO
    gate?: string | null;
    by?: string | null; // staff
  }>;
}

// Discriminated map: report kind -> payload type
export interface ReportPayloadMap {
  sales: SalesReport;
  attendees: AttendeesReport;
  checkins: CheckinsReport;
}
