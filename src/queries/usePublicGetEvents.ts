import { useQuery } from "@tanstack/react-query";
import { eventsClientPublic } from "../api/event.client";
import { PublicEventFilters } from "../api/event.client";

export const GET_PUBLIC_EVENTS_QUERY_KEY = "getPublicEvents";

export const usePublicGetEvents = (filters: PublicEventFilters) => {
  return useQuery({
    queryKey: [GET_PUBLIC_EVENTS_QUERY_KEY, filters],
    queryFn: async () => {
      // /api/public/events endpoint
      const response = await eventsClientPublic.listAll(filters);
      return response;
    },
  });
};
