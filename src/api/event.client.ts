import { api } from "./client";
import {
  CheckInStats,
  Event,
  EventDuplicatePayload,
  EventStats,
  GenericDataResponse,
  GenericPaginatedResponse,
  IdParam,
  Image,
  ImageType,
  QueryFilters,
} from "../types";
import { publicApi } from "./public-client.ts";
import { queryParamsHelper } from "../utilites/queryParamsHelper.ts";
import { ReportKind, ReportPayloadMap } from "../types/reports.ts";

/* ---------- Public filters/types ---------- */

export type SortDir = "asc" | "desc";

export interface PublicEventFilters {
  page?: number;
  per_page?: number;
  limit?: number;
  sort_by?: "start_date" | "created_at" | "title";
  sort_direction?: SortDir;
  query?: string;
  category?: string | number;
  eventsStatus?: "upcoming" | "all";
  upcoming?: boolean;
}

function buildPublicQS(filters?: PublicEventFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();

  if (filters.page != null) params.set("page", String(filters.page));
  if (filters.per_page != null) params.set("per_page", String(filters.per_page));
  if (filters.limit != null) params.set("limit", String(filters.limit));
  if (filters.sort_by) params.set("sort_by", filters.sort_by);
  if (filters.sort_direction) params.set("sort_direction", filters.sort_direction);
  if (filters.query) params.set("query", filters.query);
  if (filters.category != null) params.set("category", String(filters.category));
  if (filters.eventsStatus) params.set("eventsStatus", filters.eventsStatus);
  if (typeof filters.upcoming === "boolean") params.set("upcoming", filters.upcoming ? "1" : "0");

  const s = params.toString();
  return s ? `?${s}` : "";
}

/** Matches backend EventResourcePublic */
export type EventSummaryPublic = {
  id: IdParam;
  slug?: string;
  title: string;
  start_date?: string;
  end_date?: string;
  currency?: string | null;
  category?: string | number | null;
  description_preview?: string | null;
  venue?: string | null; // keep optional; may be nested in location_details
  images?: Array<{
    id: string | number;
    url: string;
    type?: string | null; // e.g., EVENT_COVER
    file_name?: string | null;
  }>;
  lowestPrice?: number | null; // if you compute/append server-side
};

/* ---------- Admin (authenticated) ---------- */

export const eventsClient = {
  create: async (event: Partial<Event>) => {
    const response = await api.post<GenericDataResponse<Event>>("events", event);
    return response.data;
  },

  all: async (pagination: QueryFilters) => {
    const response = await api.get<GenericPaginatedResponse<Event>>(
      "events" + queryParamsHelper.buildQueryString(pagination),
    );
    return response.data;
  },

  update: async (eventId: IdParam, event: Partial<Event>) => {
    const response = await api.put<GenericDataResponse<Event>>("events/" + eventId, event);
    return response.data;
  },

  findByID: async (eventId: IdParam) => {
    const response = await api.get<GenericDataResponse<Event>>("events/" + eventId);
    return response.data;
  },

  getEventStats: async (eventId: IdParam) => {
    const response = await api.get<GenericDataResponse<EventStats>>("events/" + eventId + "/stats");
    return response.data;
  },

  getEventCheckInStats: async (eventId: IdParam) => {
    const response = await api.get<GenericDataResponse<CheckInStats>>(
      "events/" + eventId + "/check_in_stats",
    );
    return response.data;
  },

  getEventImages: async (eventId: IdParam) => {
    const response = await api.get<GenericDataResponse<Image[]>>("events/" + eventId + "/images");
    return response.data;
  },

  uploadEventImage: async (eventId: IdParam, image: File, type: ImageType = "EVENT_COVER") => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("type", type);
    const response = await api.post<GenericDataResponse<Image>>(
      "events/" + eventId + "/images",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  deleteEventImage: async (eventId: IdParam, imageId: IdParam) => {
    const response = await api.delete<GenericDataResponse<Image>>(
      "events/" + eventId + "/images/" + imageId,
    );
    return response.data;
  },

  /** FIXED: correct verb */
  delete: async (eventId: IdParam) => {
    const response = await api.delete<GenericDataResponse<Event>>("events/" + eventId);
    return response.data;
  },

  duplicate: async (eventId: IdParam, event: EventDuplicatePayload) => {
    const response = await api.post<GenericDataResponse<Event>>(
      "events/" + eventId + "/duplicate",
      event,
    );
    return response.data;
  },

  updateEventStatus: async (eventId: IdParam, status: string) => {
    const response = await api.put<GenericDataResponse<Event>>("events/" + eventId + "/status", {
      status,
    });
    return response.data;
  },

  getEventReport: async <K extends ReportKind>(
    eventId: IdParam,
    reportType: K,
    startDate?: string,
    endDate?: string,
  ) => {
    const params = new URLSearchParams();
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);

    const response = await api.get<GenericDataResponse<ReportPayloadMap[K]>>(
      `events/${eventId}/reports/${reportType}${params.toString() ? `?${params.toString()}` : ""}`,
    );
    return response.data;
  },
};

/* ---------- Public (no auth) ---------- */

export const eventsClientPublic = {
  /**
   * Public listing of all events (not organizer-scoped).
   * GET /api/public/events
   */
  listAll: async (filters?: PublicEventFilters) => {
    const response = await publicApi.get<GenericPaginatedResponse<EventSummaryPublic>>(
      `events${buildPublicQS(filters)}`,
    );
    return response.data;
  },
  /**
   * Organizer-scoped public listing (keeps paginator for pages that need total/pages).
   * GET /api/public/organizers/{organizerId}/events
   */
  listForOrganizer: async (
    organizerId: number | string,
    filters?: PublicEventFilters,
  ) => {
    const response = await publicApi.get<GenericPaginatedResponse<EventSummaryPublic>>(
      `organizers/${organizerId}/events${buildPublicQS(filters)}`,
    );
    return response.data;
  },

  /**
   * Homepage helper: returns a plain array of upcoming events (no paginator).
   * Internally normalizes {data: []} | {items: []} | [] to [].
   */
  homepage: async (organizerId: number | string, limit = 6): Promise<EventSummaryPublic[]> => {
    const response = await publicApi.get<
      GenericPaginatedResponse<EventSummaryPublic> | EventSummaryPublic[]
    >(
      `organizers/${organizerId}/events` +
        buildPublicQS({
          eventsStatus: "upcoming",
          upcoming: true,
          per_page: limit,
          sort_by: "start_date",
          sort_direction: "asc",
        }),
    );

    const body = response.data as unknown;
    if (Array.isArray(body)) return body as EventSummaryPublic[];
    const maybe = body as { data?: unknown; items?: unknown };
    if (Array.isArray(maybe.data)) return maybe.data as EventSummaryPublic[];
    if (Array.isArray(maybe.items)) return maybe.items as EventSummaryPublic[];
    return [];
  },

  /** Public single event by numeric/short id (existing public route). */
  findByID: async (eventId: IdParam) => {
    const response = await publicApi.get<GenericDataResponse<Event>>(`events/${eventId}`);
    return response.data;
  },

  /**
   * Optional convenience if you expose a slug route:
   * GET /api/public/organizers/{organizerId}/events/slug/{eventSlug}
   * (If not implemented on backend, remove this to avoid 404s.)
   */
  findBySlug: async (organizerId: number | string, eventSlug: string) => {
    const response = await publicApi.get<GenericDataResponse<Event>>(
      `organizers/${organizerId}/events/slug/${eventSlug}`,
    );
    return response.data;
  },
};
