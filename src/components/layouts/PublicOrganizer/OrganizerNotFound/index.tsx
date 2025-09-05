import {t} from '@lingui/macro';
import {IconCalendarPlus} from '@tabler/icons-react';
import {GenericErrorPage} from "../../../common/GenericErrorPage";

export const OrganizerNotFound = () => {
    return (
        <GenericErrorPage
            title={`Organizer Not Found`}
            description={`The organizer you're looking for could not be found. The page may have been moved, deleted, or the URL might be incorrect.`}
            pageTitle={`Organizer Not Found`}
            metaDescription={`The organizer you're looking for could not be found. The page may have been moved, deleted, or the URL might be incorrect.`}
            buttonText={`Create your own Event`}
            buttonUrl="https://app.iCrawn.Events/auth/register?utm_source=app.iCrawn.Events&utm_content=organizer-not-found/create-event"
            buttonIcon={<IconCalendarPlus size={18}/>}
        >

        </GenericErrorPage>
    );
};

export default OrganizerNotFound;
