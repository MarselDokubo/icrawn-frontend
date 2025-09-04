import { useLoaderData } from "react-router";
import EventHomepage from "../EventHomepage";
import { Event } from "../../../types";
import PublicSiteLayout from "../PublicSiteLayout"; // ⬅️ add this

export const PublicEvent = () => {
  const loaderData = useLoaderData();

  const { event, promoCodeValid, promoCode } = loaderData as {
    event?: Event;
    promoCodeValid?: boolean;
    promoCode?: string;
  };

  return (
    <PublicSiteLayout>
      <EventHomepage
        event={event}
        promoCodeValid={promoCodeValid}
        promoCode={promoCode}
        backgroundType={event?.settings?.homepage_background_type}
      />
    </PublicSiteLayout>
  );
};

export default PublicEvent;
