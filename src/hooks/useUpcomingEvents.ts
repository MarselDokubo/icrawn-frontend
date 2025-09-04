
import { useQuery } from "@tanstack/react-query";
import { eventsClientPublic, EventSummaryPublic } from "../api/event.client";

export function useUpcomingEvents(limit = 5) {
  return useQuery<EventSummaryPublic[]>({
    queryKey: ["publicEvents", "upcoming", limit],
    queryFn: async () => {
      const response = await eventsClientPublic.listAll({
        eventsStatus: "upcoming",
        upcoming: true,
        per_page: limit,
        sort_by: "start_date",
        sort_direction: "asc",
      });
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  return [];
    },
    staleTime: 60_000,
  });
}
