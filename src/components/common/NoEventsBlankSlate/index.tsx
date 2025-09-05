 
import {Button} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import {NoResultsSplash} from "../NoResultsSplash";

interface NoEventsBlankSlateProps {
    eventsState?: 'upcoming' | 'ended' | 'archived' | string
    openCreateModal: () => void;
}

export const NoEventsBlankSlate = ({eventsState, openCreateModal}: NoEventsBlankSlateProps) => {
    return (
        <NoResultsSplash
            heading={`No events to show`}
            imageHref={'/blank-slate/events.svg'}
            subHeading={(
                <>
                    <p>
                        {(eventsState === 'upcoming' || !eventsState) && `Once you create an event, you'll see it here.`}
                        {eventsState === 'ended' && `No ended events to show.`}
                        {eventsState === 'archived' && `No archived events to show.`}
                    </p>
                    <Button
                        size={'xs'}
                        leftSection={<IconPlus/>}
                        color={'green'}
                        onClick={openCreateModal}>{`Create Event`}
                    </Button>
                </>
            )}
        />
    );
}
