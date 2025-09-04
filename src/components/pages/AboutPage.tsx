import React from 'react';
import { Container, Title, Text } from '@mantine/core';
import { t } from '@lingui/macro';

const AboutPage: React.FC = () => (
  <Container size="md" py={40}>
    <Title order={1}>{`About Us`}</Title>
    <Text mt="md" size="lg">
        {`We are dedicated to bringing you the best events and experiences. Learn more about our mission and team here.`}
    </Text>
  </Container>
);

export default AboutPage;
