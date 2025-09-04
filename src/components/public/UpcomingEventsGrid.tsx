import { Card, Image, Text, Group, Badge, Button, SimpleGrid, Skeleton } from "@mantine/core";
import { Link } from "react-router-dom";
import { useUpcomingEvents } from "@/hooks/useUpcomingEvents";
import type { EventSummaryPublic } from "@/api/event.client";
import { t } from "@lingui/macro";

function getCoverUrl(ev: EventSummaryPublic): string | null {
  const images = ev.images ?? [];
  const cover = images.find((i) => i.type === "EVENT_COVER") ?? images[0];
  return cover?.url ?? null;
}

function eventUrl(ev: EventSummaryPublic) {
  // Canonical route when slug exists; fallback to old route which will redirect to canonical
  return ev.slug ? `/event/${ev.id}/${ev.slug}` : `/events/${ev.id}`;
}

export default function UpcomingEventsGrid({
  limit = 4,
}: {
  limit?: number;
}) {
  const { data, isLoading } = useUpcomingEvents(limit);

  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
        {Array.from({ length: limit }).map((_, i) => (
          <Card key={i} radius="xl" shadow="md" p="md" withBorder>
            <Skeleton h={250} />
            <Skeleton h={16} mt="md" />
            <Skeleton h={12} mt="sm" w="70%" />
            <Skeleton h={36} mt="md" />
          </Card>
        ))}
      </SimpleGrid>
    );
  }

  if (!data || data.length === 0) {
    return <Text c="dimmed">{t`No upcoming events yet.`}</Text>;
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
      {data.map((ev: EventSummaryPublic) => {
        const start = ev.start_date ? new Date(ev.start_date) : undefined;
        const dateLabel = start && !isNaN(start.getTime()) ? start.toLocaleString() : "";
        const coverUrl = getCoverUrl(ev);

        return (
          <Card key={String(ev.id)} radius="xl" shadow="md" p="md" withBorder>
            {coverUrl ? (
              <Image src={coverUrl} alt={ev.title} h={300} radius="md" fit="cover" />
            ) : (
              <div
                style={{
                  height: 180,
                  background: "var(--mantine-color-gray-2)",
                  borderRadius: 12,
                }}
              />
            )}
            {dateLabel && (
              <Badge mt="sm" variant="light">
                {dateLabel}
              </Badge>
            )}

            <Text fw={700} mt="xs">
              {ev.title}
            </Text>

            {ev.venue && (
              <Text size="sm" c="dimmed">
                {ev.venue}
              </Text>
            )}

            {typeof ev.lowestPrice === "number" && (
              <Text mt="xs">
                {t`From`} ₦{ev.lowestPrice.toLocaleString("en-NG")}
              </Text>
            )}

            <Group mt="md">
              <Button component={Link} to={eventUrl(ev)} radius="xl">
                {t`View details`}
              </Button>
            </Group>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
