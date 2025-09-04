import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  List,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  rem,
} from "@mantine/core";
import {
  IconMail,
  IconPlayerPlayFilled,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconTicket,
  IconHeart,
IconSparkles,
  IconMicrophone,
  IconMasksTheater
} from "@tabler/icons-react";
import { t } from "@lingui/macro";
import UpcomingEventsGrid from "../public/UpcomingEventsGrid";
import { useUpcomingEvents } from "@/hooks/useUpcomingEvents";
import Hero from "./_components/Hero";

const targetDate = new Date();
targetDate.setMonth(targetDate.getMonth() + 10);






function IntroSection() {
  return (
    <Container size="lg" py={60}>
      <Stack gap="xs" align="center">
        <Badge variant="light">{`iCrawn Events 2025`}</Badge>
        <Title order={2} style={{ fontSize: rem(48), lineHeight: 1.1 }} ta="center">
          {`Upcoming Events`}
        </Title>
        <Text maw={800} ta="center" c="dimmed">
          {`In collaboration with top global partners, iCrawn Events is where inventive and forward-thinking leaders come together to discover emerging trends in fundraising and technology.`}
        </Text>
      </Stack>
    </Container>
  );
}

export function ServicesSection() {
  return (
    <Container size="lg" py={80}>
      <Stack gap="xl" align="center">
        <Title order={2}>{`ICRAWN EVENTS – Your Vision, Our Creation`}</Title>
        <Text maw={800} ta="center" c="dimmed">
          {`At ICRAWN EVENTS, we don’t just organize occasions – we craft unforgettable experiences. Whether it’s a grand wedding, a high-profile corporate gathering, a thrilling live show, or an intimate birthday celebration, our team turns your ideas into moments worth cherishing.`}
        </Text>
        <Text maw={800} ta="center" c="dimmed">
          {`We specialize in organizing, packaging, and planning both social and corporate events, ensuring every detail reflects your style, purpose, and personality. We also give your event modern branding like no other, designed to suit your unique taste and elevate your celebration to a whole new level.`}
        </Text>
        <List spacing="sm" size="md">
          <List.Item>{`🎟 Ticket Sales – Available both online and offline for maximum convenience.`}</List.Item>
          <List.Item>{`💒 Weddings – From proposal to “I Do,” we handle it all.`}</List.Item>
          <List.Item>{`🎉 Birthdays – Fun, stylish, and uniquely yours.`}</List.Item>
          <List.Item>{`🎤 Artist Management – We work closely with talents to create memorable performances.`}</List.Item>
          <List.Item>{`🎭 Shows & Entertainment – Well-curated events that captivate audiences.`}</List.Item>
        </List>
        <Title order={3}>{`We Bring Your Dream Event to Reality.`}</Title>
      </Stack>
    </Container>
  );
}

function VideoCards() {
  const videos = [
    { date: `October 3, 2022`, title: `Virtual sessions. Eventor Live@MAX` },
    { date: `October 4, 2022`, title: `Opening` },
    { date: `October 12, 2022`, title: `Inspiration Ar` },
  ];

  return (
    <Container size="lg" pb={80} id="video">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
        {videos.map((v) => (
          <Card key={v.title} radius="xl" shadow="md" p={0} style={{ overflow: "hidden" }}>
            <Box h={180} style={{
              background:
                `radial-gradient(400px 160px at 30% 30%, rgba(147,51,234,0.8) 0%, transparent 60%),
 radial-gradient(400px 160px at 70% 70%, rgba(99,102,241,0.8) 0%, transparent 60%),
 linear-gradient(135deg, #0f0c29, #302b63, #24243e)`,
            }} />
            <Stack p="md" gap={6}>
              <Text c="dimmed" size="sm">{v.date}</Text>
              <Group justify="space-between" align="center">
                <Title order={4}>{v.title}</Title>
                <ThemeIcon radius="xl" variant="light">
                  <IconPlayerPlayFilled />
                </ThemeIcon>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}

// ================== NEW CONTENT SECTIONS ==================
function AboutICrawn() {
  return (
    <Container size="lg" py={80} id="about">
      <Grid align="stretch" gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack>
            <Badge variant="light">{`ICRAWN EVENTS – Your Vision, Our Creation`}</Badge>
            <Title order={2}>{`We craft unforgettable experiences`}</Title>
            <Text c="dimmed">
              {`At ICRAWN EVENTS, we don’t just organize occasions – we craft unforgettable experiences. Whether it’s a grand wedding, a high-profile corporate gathering, a thrilling live show, or an intimate birthday celebration, our team turns your ideas into moments worth cherishing.`}
            </Text>
            <Text c="dimmed">
              {`We specialize in organizing, packaging, and planning both social and corporate events, ensuring every detail reflects your style, purpose, and personality. We also give your event modern branding like no other, designed to suit your unique taste and elevate your celebration to a whole new level.`}
            </Text>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper radius="xl" shadow="lg" p="lg">
            <Stack gap="sm">
              <Group>
                <ThemeIcon radius="md" variant="light"><IconTicket /></ThemeIcon>
                <Text fw={600}>{`Ticket Sales`}</Text>
              </Group>
              <Text c="dimmed">{`Available both online and offline for maximum convenience.`}</Text>

              <Divider my="sm" />

              <Group>
                <ThemeIcon radius="md" variant="light"><IconHeart size={16} /></ThemeIcon>
                <Text fw={600}>{`Weddings`}</Text>
              </Group>
              <Text c="dimmed">{`From proposal to "I Do," we handle it all.`}</Text>

              <Divider my="sm" />

              <Group>
                <ThemeIcon radius="md" variant="light"><IconSparkles size={16} /></ThemeIcon>
                <Text fw={600}>{`Birthdays`}</Text>
              </Group>
              <Text c="dimmed">{`Fun, stylish, and uniquely yours.`}</Text>

              <Divider my="sm" />

              <Group>
                <ThemeIcon radius="md" variant="light"><IconMicrophone size={16} /></ThemeIcon>
                <Text fw={600}>{`Artist Managemen`}</Text>
              </Group>
              <Text c="dimmed">{`We work closely with talents to create memorable performances.`}</Text>

              <Divider my="sm" />

              <Group>
                <ThemeIcon radius="md" variant="light"><IconMasksTheater size={16} /></ThemeIcon>
                <Text fw={600}>{`Shows & Entertainmen`}</Text>
              </Group>
              <Text c="dimmed">{`Well‑curated events that captivate audiences.`}</Text>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

function CTASection() {
  return (
    <Box py={60} style={{
      background: `linear-gradient(135deg, rgba(147,51,234,0.1), rgba(99,102,241,0.1))`,
      borderTop: `1px solid var(--mantine-color-gray-3)`,
      borderBottom: `1px solid var(--mantine-color-gray-3)`,
    }}>
      <Container size="lg">
        <Group justify="space-between" align="center" wrap="wrap">
          <Stack gap={4}>
            <Title order={3}>{`We Bring Your Dream Event to Reality.`}</Title>
            <Text c="dimmed">{`Let’s make your next event bigger, brighter, and better than you imagined.`}</Text>
          </Stack>
          <Button radius="xl" size="md" variant="gradient" gradient={{ from: "grape", to: "indigo" }}>
            {`Get a Quote`}
          </Button>
        </Group>
      </Container>
    </Box>
  );
}

function ConnectSection() {
  const contacts = [
    {
      icon: IconBrandInstagram,
      title: `Instagram`,
      label: `@icrawn.events`,
      href: "#",
      color: "pink",
    },
    {
      icon: IconMail,
      title: `Email`,
      label: `icrawnevents@gmail.com`,
      href: "mailto:icrawnevents@gmail.com",
      color: "blue",
    },
    {
      icon: IconBrandFacebook,
      title: `Facebook`,
      label: `@icrawn events managemen`,
      href: "#",
      color: "blue",
    },
    {
      icon: IconBrandWhatsapp,
      title: `WhatsApp`,
      label: `(+234)-706-7823-892`,
      href: "https://wa.me/07067823892",
      color: "green",
    },
  ];

  return (
    <Container size="lg" py={60} id="contact">
      <Title order={3} ta="center" mb="md">
        {`Connect With Us`}
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="lg">
        {contacts.map((contact) => {
          const Icon = contact.icon;
          return (
            <Paper key={contact.title} withBorder radius="lg" p="md">
              <Stack align="center" gap="xs">
                <ThemeIcon
                  variant="light"
                  radius="xl"
                  size={48}
                  color={contact.color}
                >
                  <Icon size={24} />
                </ThemeIcon>
                <Text fw={600}>{contact.title}</Text>
                <Anchor href={contact.href} target="_blank">
                  {contact.label}
                </Anchor>
              </Stack>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Container>
  );
}

export default function IcrawnLanding() {

  const { data } = useUpcomingEvents(6);
  console.log({returned:data});
  // const nextEventDate = useMemo(() => {
  //   if (!data?.length) return undefined;
  //   let min = Number.POSITIVE_INFINITY;
  //   for (const ev of data as EventSummaryPublic[]) {
  //     const iso = ev.start_date;
  //     if (!iso) continue;
  //     const ms = Date.parse(iso);
  //     if (!Number.isNaN(ms) && ms > Date.now()) min = Math.min(min, ms);
  //   }
  //   return min !== Number.POSITIVE_INFINITY ? new Date(min) : undefined;
  // }, [data]);

  return (
    <>
      <Hero />
      <IntroSection />
      <Container size="lg" pb={40}>
        <UpcomingEventsGrid limit={6} />
      </Container>

      {/* <VideoCards /> */}
      <AboutICrawn />
      <CTASection />
      <ConnectSection />
    </>
  );
}
