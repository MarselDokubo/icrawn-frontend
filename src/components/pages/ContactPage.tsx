import React from 'react';
import { Container, Title, Text } from '@mantine/core';
import { t } from '@lingui/macro';

const HomePage: React.FC = () => (
  <Container size="md" py={40}>
    <Title order={1}>{t`Welcome to Our Events Platform`}</Title>
    <Text mt="md" size="lg">
      {t`Discover amazing events, Book Events, and learn more about us.`}
    </Text>
  </Container>
);

export default HomePage;
