
import {
  Alert, Badge, Box, Button, Container, Divider, Grid, Group, Image as MantineImage,
  Paper, SimpleGrid, Skeleton, Stack, Text, ThemeIcon, Title, rem,
} from "@mantine/core";
import { IconAlertCircle, IconMail, IconMapPin, IconPhone, IconPlayerPlayFilled } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useInterval, useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";

import { usePublicGetEvents } from "@/queries/usePublicGetEvents";
import { eventsClientPublic } from "@/api/event.client";
import type { Event, Image as EventImage, ProductCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";

/* ---------- helpers ---------- */
function useCountdown(target?: Date) {
  const [now, setNow] = useState<Date>(new Date());
  const interval = useInterval(() => setNow(new Date()), 1000);
  useEffect(() => { interval.start(); return interval.stop; }, [interval]);

  if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    seconds: Math.floor(diff / 1000) % 60,
    minutes: Math.floor(diff / (1000 * 60)) % 60,
    hours:   Math.floor(diff / (1000 * 60 * 60)) % 24,
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
  };
}

/* ---------- floating glass countdown ---------- */
function GlassCountdownCard({ target }: { target?: Date }) {
  const { days, hours, minutes, seconds } = useCountdown(target);

  const Stat = ({ label, value }: { label: string; value: number }) => (
    <Stack gap={4} align="center">
      <Title order={2}>{String(value).padStart(2, "0")}</Title>
      <Text c="dimmed" fw={500} size="sm">{label}</Text>
    </Stack>
  );

  return (
    <Paper
      radius="xl"
      shadow="xl"
      p="xl"
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: `linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.10))`,
        border: `1px solid rgba(255,255,255,0.22)`,
        boxShadow: `0 24px 48px rgba(0,0,0,0.25)`,
      }}
    >
      <Group justify="space-around" gap="xl" wrap="nowrap">
        <Stat label={`Days`} value={days} />
        <Divider orientation="vertical" style={{ opacity: 0.4 }} />
        <Stat label={`Hours`} value={hours} />
        <Divider orientation="vertical" style={{ opacity: 0.4 }} />
        <Stat label={`Minutes`} value={minutes} />
        <Divider orientation="vertical" style={{ opacity: 0.4 }} />
        <Stat label={`Seconds`} value={seconds} />
      </Group>
    </Paper>
  );
}

function getCoverUrl(event?: Event): string | undefined {
  const cover = (event?.images ?? ([] as EventImage[])).find((img) => img.type === "EVENT_COVER");
  return cover?.url;
}
function formatMonthYear(date?: Date) {
  if (!date) return `Upcoming Event`;
  return new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(date);
}

function LoadingHero() {
  return (
    <Box pt={60} pb={140}>
      <Container size="lg">
        <Grid align="center" gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="md">
              <Skeleton w={200} h={30} radius="md" />
              <Skeleton w="80%" h={44} radius="md" />
              <Skeleton w="95%" h={20} />
              <Group gap="md">
                <Skeleton w={130} h={36} radius="xl" />
                <Skeleton w={120} h={36} radius="xl" />
              </Group>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Skeleton h={280} radius="xl" />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}

/* ---------- main ---------- */
export default function Hero() {
  // 1) get the next upcoming event (summary)
  const { data: eventsResp, isLoading, isError, error } = usePublicGetEvents({
    limit: 1,
    sort_by: "start_date",
    sort_direction: "asc",
    upcoming: true,
  });

  const upcomingEventSummary = eventsResp?.data?.[0];
  const eventId = upcomingEventSummary?.id;

  // 2) fetch the full event for richer fields (attributes, product_categories, images)
  type PublicAttribute = { name: string; value?: string; is_public?: boolean };
  type FullEvent = Event & {
    attributes?: PublicAttribute[];
    product_categories?: (ProductCategory & { name?: string })[];
  };

  const { data: fullEvent } = useQuery<FullEvent>({
    queryKey: ["publicEventFull", eventId],
    enabled: !!eventId,
    queryFn: async () => {
      const { data } = await eventsClientPublic.findByID(eventId);
      return data as FullEvent;
    },
    staleTime: 60_000,
  });

  // 3) pick fields
  const coverUrl = useMemo(
    () => getCoverUrl(fullEvent ?? (upcomingEventSummary as unknown as Event)) ?? "/Landing.jpeg",
    [fullEvent, upcomingEventSummary]
  );
  const eventStart = useMemo(
    () =>
      fullEvent?.start_date
        ? new Date(fullEvent.start_date)
        : upcomingEventSummary?.start_date
        ? new Date(upcomingEventSummary.start_date)
        : undefined,
    [fullEvent, upcomingEventSummary]
  );
  const eventTitle = fullEvent?.title ?? upcomingEventSummary?.title ?? `Upcoming Event`;
  const eventDescription =
    fullEvent?.description_preview ??
    upcomingEventSummary?.description_preview ??
    `Join us for our upcoming event featuring forward-thinking leaders and great experiences.`;

  // 4) dynamic tags
  const dynamicTags: string[] = useMemo(() => {
    const tags: string[] = [];
    (fullEvent?.attributes ?? []).forEach((a) => a?.name && tags.push(a.name));
    (fullEvent?.product_categories ?? []).forEach((c) => c?.name && tags.push(c.name));
    if (tags.length === 0 && upcomingEventSummary?.category) tags.push(String(upcomingEventSummary.category));
    return Array.from(new Set(tags));
  }, [fullEvent, upcomingEventSummary]);

  // 5) ticket link
  const eventPath =
    (fullEvent?.id ?? upcomingEventSummary?.id) && (fullEvent?.slug ?? upcomingEventSummary?.slug)
      ? `/event/${fullEvent?.id ?? upcomingEventSummary?.id}/${fullEvent?.slug ?? upcomingEventSummary?.slug}`
      : (fullEvent?.id ?? upcomingEventSummary?.id)
        ? `/event/${fullEvent?.id ?? upcomingEventSummary?.id}/preview`
        : "#";

  // darker, brand-tinted overlay
  const heroBg = `
    radial-gradient(1200px 400px at 20% 10%, rgba(99,102,241,0.25) 0%, transparent 60%),
    radial-gradient(1200px 500px at 80% 20%, rgba(168,85,247,0.25) 0%, transparent 60%),
    linear-gradient(135deg, rgba(30,27,75,0.70), rgba(17,24,39,0.65)),
    url(${coverUrl})
  `;

  // responsive offsets for the floating card
  const isSm = useMediaQuery(`(max-width: 768px)`);
  const floatBottom = isSm ? -48 : -64;
  const floatWidth  = isSm ? `calc(100% - 24px)` : `min(100%, 1000px)`;

  if (isLoading) return <LoadingHero />;

  if (isError) {
    return (
      <Container size="lg" pt="xl" pb="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title={`Failed to load event`}
          color="red"
          variant="light"
          radius="md"
        >
          {error?.message ?? `An error occurred while fetching the upcoming event.`}
        </Alert>
      </Container>
    );
  }

if (!upcomingEventSummary) {
  const heroBg = `
    linear-gradient(135deg, rgba(30,27,75,0.70), rgba(17,24,39,0.65)),
    url(/Gradient_Landing.jpeg)
  `;
  return (
    <Box
      pt={60}
      pb={140}
      style={{
        position: "relative",
        background: heroBg,
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        marginBottom: 150,
      }}
    >
      <Container size="lg">
        <Grid align="center" gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="md">
              <Badge variant="light" size="lg" radius="md" style={{color:"#ffffffaa"}}>
                Upcoming Event
              </Badge>
              <Title order={1} style={{ fontSize: rem(48), lineHeight: 1.1, position: "relative", zIndex: 20, color: "white" }}>
                More events coming soon
              </Title>
              <Text size="lg" style={{color:"#ffffffdd"}}>
                Stay tuned for our upcoming events...
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack align="center">
              <MantineImage radius="xl" src="/Coming_Soon.jpeg" alt="Events coming soon" h={300} fit="cover" />
              <Group>
                <Badge variant="outline">{`CONF`}</Badge>
                <Badge color="grape" variant="light">{`Public`}</Badge>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
      {/* CONTACT INFO GRID */}
      <Container size="lg" mt="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <Paper withBorder radius="lg" p="md">
            <Group>
              <ThemeIcon variant="light" color="grape" radius="md">
                <IconMail />
              </ThemeIcon>
              <Text>{`icrawnevents@gmail.com`}</Text>
            </Group>
          </Paper>
          <Paper withBorder radius="lg" p="md">
            <Group>
              <ThemeIcon variant="light" color="indigo" radius="md">
                <IconMapPin />
              </ThemeIcon>
              <Text>{`Plot 421 Hillside FCT ABUJA`}</Text>
            </Group>
          </Paper>
          <Paper withBorder radius="lg" p="md">
            <Group>
              <ThemeIcon variant="light" color="violet" radius="md">
                <IconPhone />
              </ThemeIcon>
              <Text>{`(+234)-706-7823-892`}</Text>
            </Group>
          </Paper>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

  return (
    <Box
      pt={60}
      pb={140}
      style={{
        position: "relative",
        background: heroBg,
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        marginBottom: 150,
      }}
    >
      <Container size="lg">
        <Grid align="center" gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="md">
              <Badge variant="light" size="lg" radius="md" style={{color:"#ffffffaa"}}>
                {formatMonthYear(eventStart)}
              </Badge>

              <Title order={1} style={{ fontSize: rem(48), lineHeight: 1.1, position: "relative", zIndex: 20, color: "white" }}>
                {eventTitle}
              </Title>

              <Text size="lg" style={{color:"#ffffffdd"}}>
                {eventDescription}
              </Text>

              <Group gap="md">
                <Button
                  size="md"
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: "grape", to: "indigo" }}
                  component={Link}
                  to={eventPath}
                  disabled={!eventId}
                >
                  {`Get Tickets`}
                </Button>
                <Button
                  size="md"
                  radius="xl"
                  variant="subtle"
                  leftSection={<IconPlayerPlayFilled size={16} />}
                  component={Link}
                  to="/contact"
                  style={{color:"#ffffffcc"}}
                >
                  {`Inquire`}
                </Button>
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack align="center">
              <MantineImage radius="xl" src={coverUrl} alt={eventTitle} h={300} fit="cover" />
              <Group>
                {dynamicTags.length > 0 ? (
                  dynamicTags.map((tag) => (
                    <Badge key={tag} variant="light" color="grape">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <>
                    <Badge variant="outline">{`CONF`}</Badge>
                    <Badge color="grape" variant="light">{`Public`}</Badge>
                  </>
                )}
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>

      {/* FLOATING GLASS COUNTDOWN */}
      <Container size="lg">
        <Box
          style={{
            position: "absolute",
            left: "50%",
            bottom: floatBottom,
            transform: "translateX(-50%)",
            width: floatWidth,
            zIndex: 5,
          }}
        >
          <GlassCountdownCard target={eventStart} />
        </Box>
      </Container>

      {/* CONTACT INFO GRID */}
      <Container size="lg" mt="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <Paper withBorder radius="lg" p="md">
            <Group>
              <ThemeIcon variant="light" color="grape" radius="md">
                <IconMail />
              </ThemeIcon>
              <Text>{`icrawnevents@gmail.com`}</Text>
            </Group>
          </Paper>
          <Paper withBorder radius="lg" p="md">
            <Group>
              <ThemeIcon variant="light" color="indigo" radius="md">
                <IconMapPin />
              </ThemeIcon>
              <Text>{`Plot 421 Hillside FCT ABUJA`}</Text>
            </Group>
          </Paper>
          <Paper withBorder radius="lg" p="md">
            <Group>
              <ThemeIcon variant="light" color="violet" radius="md">
                <IconPhone />
              </ThemeIcon>
              <Text>{`(+234)-706-7823-892`}</Text>
            </Group>
          </Paper>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
