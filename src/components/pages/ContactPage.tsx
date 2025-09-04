import React from 'react';
import { Container, Title, Text } from '@mantine/core';


const HomePage: React.FC = () => (
  <Container size="md" py={40}>
    <Title order={1}>{`Welcome to Our Events Platform`}</Title>
    <Text mt="md" size="lg">
      {`Discover amazing events, Book Events, and learn more about us.`}
    </Text>
  </Container>
);

export default HomePage;
