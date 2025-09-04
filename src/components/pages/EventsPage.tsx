import React from 'react';
import { Container, Title } from '@mantine/core';
import { usePublicGetEvents } from '../../queries/usePublicGetEvents';
import { EventCardPublic } from '../common/EventCardPublic';
import { t } from '@lingui/macro';

const EventsPage: React.FC = () => {
  const { data: events, isLoading } = usePublicGetEvents({ page: 1 });

  return (
    <Container size="md" py={40}>
      <Title order={1}>{`All Events`}</Title>
      {isLoading ? (
        <div>{`Loading events...`}</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem' }}>
          {events?.data?.map((event) => (
            <EventCardPublic key={event.id} event={event} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default EventsPage;
