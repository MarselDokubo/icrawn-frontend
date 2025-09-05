import {t} from '@lingui/macro';
import {IconCalendarPlus} from '@tabler/icons-react';
import {GenericErrorPage} from "../../../common/GenericErrorPage";
import {isHiEvents} from "../../../../utilites/helpers.ts";

export const EventNotAvailable = () => {
    return (
        <GenericErrorPage
            title={`Event Not Available`}
            description={`The event you're looking for is not available at the moment. It may have been removed, expired, or the URL might be incorrect.`}
            pageTitle={`Event Not Available`}
            metaDescription={`The event you're looking for is not available at the moment. It may have been removed, expired, or the URL might be incorrect.`}
            buttonText={isHiEvents() ? `Create your own Event` : undefined}
            buttonUrl={isHiEvents() ? "https://app.iCrawn.Events/auth/register?utm_source=app.iCrawn.Events&utm_content=organizer-not-found/create-event" : undefined}
            buttonIcon={<IconCalendarPlus size={18}/>}
        />
    );
};

export default EventNotAvailable;
