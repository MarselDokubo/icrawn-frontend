import {Event} from "../../../types.ts";
import {Badge} from "@mantine/core";
 

interface EventLifecycleStatusLabelProps {
    event: Event;
    showLifecycleStatus?: boolean;
}

export const EventStatusBadge = ({event, showLifecycleStatus = true}: EventLifecycleStatusLabelProps) => {
    const getLifecycleStatus = (() => {
        switch (event.lifecycle_status) {
            case 'ENDED':
                return `Ended`;
            case 'UPCOMING':
                return `Upcoming`;
            case 'ONGOING':
                return `Ongoing`;
            default:
                return undefined;
        }
    })();

    return (
        <>
            <Badge
                variant={'outline'}
                color={event?.status === 'LIVE' ? 'green' : event?.status === 'DRAFT' ? 'orange' : 'gray'}
                size="sm"
            >
                {event.status} {showLifecycleStatus && (
                <>
                    &bull; {getLifecycleStatus}
                </>
            )}
            </Badge>
        </>
    );
}
