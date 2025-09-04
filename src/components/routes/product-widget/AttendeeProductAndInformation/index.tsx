import {useGetEventPublic} from "../../../../queries/useGetEventPublic.ts";
import {useParams} from "react-router";
import {useGetAttendeePublic} from "../../../../queries/useGetAttendeePublic.ts";
import {AttendeeTicket} from "../../../common/AttendeeTicket";
import {Attendee, Product} from "../../../../types.ts";
import {Container} from "@mantine/core";
 
import {PoweredByFooter} from "../../../common/PoweredByFooter";
import {OnlineEventDetails} from "../../../common/OnlineEventDetails";

export const AttendeeProductAndInformation = () => {
    const {eventId, attendeeShortId} = useParams();
    const {data: event} = useGetEventPublic(eventId);
    const {data: attendee} = useGetAttendeePublic(eventId, String(attendeeShortId));

    if (!event || !attendee) {
        return null;
    }

    /**
     * (c) iCrawn.Events Ltd 2025
     *
     * PLEASE NOTE:
     *
     * iCrawn.Events is licensed under the GNU Affero General Public License (AGPL) version 3.
     *
     * You can find the full license text at: https://github.com/HiEventsDev/iCrawn.Events/blob/main/LICENCE
     *
     * In accordance with Section 7(b) of the AGPL, we ask that you retain the "Powered by iCrawn.Events" notice.
     *
     * If you wish to remove this notice, a commercial license is available at: https://iCrawn.Events/licensing
     */
    return (
        <Container>
            <h2>{`Your ticket for`} {event.title}</h2>

            <AttendeeTicket
                attendee={attendee as Attendee}
                product={attendee.product as Product}
                event={event}
            />

            {(event?.settings?.is_online_event && <OnlineEventDetails eventSettings={event.settings}/>)}

            <PoweredByFooter/>
        </Container>
    )
}

export default AttendeeProductAndInformation;
