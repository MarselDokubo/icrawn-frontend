import React, { useEffect, useState } from 'react';
import { Container, Group, Anchor, AppShell, Box, SimpleGrid, Stack, ThemeIcon, Divider } from '@mantine/core';
import { Outlet } from 'react-router-dom';

import { Title } from '@mantine/core';
import { Button } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import { Text } from '@mantine/core';




export function NavBar() {
    const navLinks = [
  { to: '/', label: () => `Home` },
  { to: '/events', label: () => `Events` },
  { to: '/about', label: () => `Abou` },
  { to: '/contact', label: () => `Contac` },
];
  return (
    <Container size="lg" py="md">
      <Group justify="space-between">
        <Group>
          <img src="/icrawn_logo.jpg" alt={`Logo`} style={{ height: 48 }} />
        </Group>
        <Group visibleFrom="sm">
          {navLinks.map((link) => (
            <Anchor key={link.to} href={link.to} c="dimmed">
              {link.label()}
            </Anchor>
          ))}
        </Group>
        <Button radius="xl" variant="gradient" gradient={{ from: "grape", to: "indigo" }}>
          {`Book Even`}
        </Button>
      </Group>
    </Container>
  );
}

function Footer() {
  return (
    <Box py={40} style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.02), transparent)` }}>
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
          <Stack>
            <Group>
              <ThemeIcon radius="xl" size={34} variant="gradient" gradient={{ from: "grape", to: "indigo" }}></ThemeIcon>
              <Title order={4}>{`ICRAWN EVENTS`}</Title>
            </Group>
            <Text c="dimmed">
              {`Your Vision, Our Creation. Premium event planning and branding for weddings, corporate events, shows and more.`}
            </Text>
          </Stack>
          <Stack>
            <Title order={5}>{`Quick Links`}</Title>
            <Anchor href="#about">{`Abou`}</Anchor>
            <Anchor href="#video">{`Video`}</Anchor>
            <Anchor href="#contact">{`Contac`}</Anchor>
          </Stack>
          <Stack>
            <Title order={5}>{`Contac`}</Title>
            <Text>{`icrawnevents@gmail.com`}</Text>
            <Text>{`1000 S Eighth Ave, NYC`}</Text>
            <Text>{`(+234)-706-7823-892`}</Text>
          </Stack>
        </SimpleGrid>
        <Divider my="lg" />
        <Text size="sm" c="dimmed">© {new Date().getFullYear()} {`ICRAWN EVENTS.`} {`All rights reserved.`}</Text>
      </Container>
    </Box>
  );
}

const PublicMainLayout: React.FC = () => {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <AppShell padding={0} header={{ height: 80 }}>
        <AppShell.Header>
            <NavBar />
        </AppShell.Header>
        <AppShell.Main>
        <Outlet />
        {showTop && (
          <Button
            pos="fixed"
            right={20}
            bottom={20}
            radius="xl"
            variant="gradient"
            gradient={{ from: "indigo", to: "grape" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            leftSection={<IconArrowUp size={16} />}
          >
            {`Top`}
          </Button>
        )}
        </AppShell.Main>
        {/* <AppShell.Footer> */}
            <Footer />
        {/* </AppShell.Footer> */}
      </AppShell>
    </>
  );
};


    {/* <Container size="lg" py={1}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <Group gap="xl">

        </Group>
      </div>
    </Container> */}
    {/* <div style={{ background: '#041b45', color: 'white', width: '100%' }}> */}
      {/* <AppShell.Header>
        <NavBar />
      </AppShell.Header> */}
    {/* </div> */}


export default PublicMainLayout;
