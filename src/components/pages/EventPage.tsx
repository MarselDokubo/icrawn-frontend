import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title, Text, Loader } from '@mantine/core';
import { useGetEventPublic } from '../../queries/useGetEventPublic';
import { Countdown } from '../common/Countdown';
import { t } from '@lingui/macro';

const EventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isLoading, error } = useGetEventPublic(eventId ?? '', true);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !event) {
    return <Container size="md" py={40}><Title order={2}>{`Event not found`}</Title></Container>;
  }

  const coverImage = event.images?.find(img => img.type === 'EVENT_COVER');

  return (
    <Container size="md" py={40}>
      <div style={{ width: '100%', height: '400px', position: 'relative', overflow: 'hidden', marginBottom: 32 }}>
        {coverImage ? (
          <img
            src={coverImage.url}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
            {`No image`}
          </div>
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(4,27,69,0.3)' }} />
      </div>
      <Title order={1}>{event.title}</Title>
      <Text mt="md" size="lg">{event.description}</Text>
      <Text mt="md" size="md" color="dimmed">{`Starts:`} {event.start_date}</Text>
      <Text mt="md" size="md" color="dimmed">{`Ends:`} {event.end_date ?? `N/A`}</Text>
      <Text mt="md" size="md" color="dimmed">
        <Countdown targetDate={event.start_date} displayType="short" />
      </Text>
    </Container>
  );
};

export default EventPage;
