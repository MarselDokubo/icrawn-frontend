import { EventSummaryPublic } from "../../../api/event.client";
import classes from "../EventCard/EventCard.module.scss";
import { Card } from "../Card";
import { formatDate } from "../../../utilites/dates";
import { t } from "@lingui/macro";

interface EventCardPublicProps {
    event: EventSummaryPublic;
}

export function EventCardPublic({ event }: EventCardPublicProps) {
    const placeholderEmojis = ['🎉', '🎪', '🎸', '🎨', '🌟', '🎭', '🎯', '🎮', '🎲', '🎳'];
    const emojiIndex = event.id ? Number(event.id) % placeholderEmojis.length : 0;
    const placeholderEmoji = placeholderEmojis[emojiIndex];
    const coverImage = event.images?.find?.(img => img.type === 'EVENT_COVER');

    return (
        <Card className={classes.eventCard}>
            <div className={classes.cardHeader}>
                <div className={classes.imageContainer}
                     style={coverImage ? { backgroundImage: `url(${coverImage.url})` } : {}}>
                    {!coverImage && (
                        <div className={classes.placeholderImage}>
                            <span className={classes.placeholderEmoji}>{placeholderEmoji}</span>
                        </div>
                    )}
                </div>
                <div className={classes.mainContent}>
                    <div className={classes.topRow}>
                        <h3 className={classes.eventTitle}>{event.title}</h3>
                    </div>
                    <div className={classes.dateTime}>
                        <div className={classes.dateBox}>
                            <span className={classes.month}>{event.start_date ? formatDate(event.start_date, 'MMM', 'UTC') : '--'}</span>
                            <span className={classes.day}>{event.start_date ? formatDate(event.start_date, 'D', 'UTC') : '--'}</span>
                        </div>
                        <div className={classes.timeInfo}>
                            <span className={classes.time}>{event.start_date ? formatDate(event.start_date, t`h:mm A`, 'UTC') : '--'}</span>
                            {event.end_date && (
                                <span className={classes.endTime}>- {formatDate(event.end_date, t`h:mm A`, 'UTC')}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
