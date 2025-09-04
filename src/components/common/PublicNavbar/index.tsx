import { useEffect, useState } from "react";
import { Anchor, Button, Container, Group } from "@mantine/core";
import { Link, NavLink } from "react-router-dom";
import { t } from "@lingui/macro";

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

      const navLinks = [
    { to: '/', label: () => t`Home` },
    { to: '/events', label: () => t`Events` },
    { to: '/about', label: () => t`About` },
    { to: '/contact', label: () => t`Contact` },
  ];
    return (
        <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: t`background 200ms ease`,
        background: scrolled
          ? t`linear-gradient(135deg, rgba(30,27,75,0.80), rgba(17,24,39,0.75))`
          : t`linear-gradient(135deg, rgba(30,27,75,0.30), rgba(17,24,39,0.25))`,
        borderBottom: t`1px solid rgba(255,255,255,0.12)`,
      }}>

      <Container size="lg" py="md">
        <Group justify="space-between">
          <Group>
            <img src="/icrawn_logo.jpg" alt={t`Logo`} style={{ height: 48 }} />
          </Group>
          <Group visibleFrom="sm">
            {navLinks.map((link) => (
              <Anchor key={link.to} href={link.to} c="dimmed">
                {link.label()}
              </Anchor>
            ))}
          </Group>
          <Button radius="xl" variant="gradient" gradient={{ from: "grape", to: "indigo" }}>
            {t`Book Event`}
          </Button>
        </Group>
      </Container>
              </div>

    );
}
