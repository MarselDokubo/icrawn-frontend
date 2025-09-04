import {ActionIcon, Button,} from '@mantine/core';
import {Event, IdParam} from "../../../types.ts";
import classes from "./EventCard.module.scss";
import {Card} from "../Card";
import {NavLink, useNavigate} from "react-router";
import {
    IconArchive,
    IconCash,
    IconCopy,
    IconDotsVertical,
    IconEye,
    IconMap,
    IconQrcode,
    IconSettings,
    IconUsers,
    IconWorld,
} from "@tabler/icons-react";
import {t} from "@lingui/macro"
import {eventHomepagePath} from "../../../utilites/urlHelper.ts";
import {EventStatusBadge} from "../EventStatusBadge";
import {useDisclosure} from "@mantine/hooks";
import {DuplicateEventModal} from "../../modals/DuplicateEventModal";
import {useState} from "react";
import {ActionMenu, ActionMenuItemsGroup, MenuItem} from '../ActionMenu';
import {confirmationDialog} from "../../../utilites/confirmationDialog.tsx";
import {showError, showSuccess} from "../../../utilites/notifications.tsx";
import {useUpdateEventStatus} from "../../../mutations/useUpdateEventStatus.ts";
import {formatCurrency} from "../../../utilites/currency.ts";
import {formatNumber} from "../../../utilites/helpers.ts";
import {formatDate} from "../../../utilites/dates.ts";

const placeholderEmojis = ['🎉', '🎪', '🎸', '🎨', '🌟', '🎭', '🎯', '🎮', '🎲', '🎳'];

interface EventCardProps {
    event: Event;
}

export function EventCard({event}: EventCardProps) {
    const navigate = useNavigate();
    const [isDuplicateModalOpen, duplicateModal] = useDisclosure(false);
    const [eventId, setEventId] = useState<IdParam>();
    const statusToggleMutation = useUpdateEventStatus();

    // Get event cover image if available
    const coverImage = event.images?.find?.(img => img.type === 'EVENT_COVER');

    // Get emoji based on event ID for consistency
    const emojiIndex = event.id ? Number(event.id) % placeholderEmojis.length : 0;
    const placeholderEmoji = placeholderEmojis[emojiIndex];

    // Only allow duplicate for Event type
    const handleDuplicate = (event: Event) => {
        setEventId(() => event.id);
        duplicateModal.open();
    }

    // Only allow status toggle for Event type
    const handleStatusToggle = (event: Event) => () => {
        const message = event?.status !== 'ARCHIVED'
            ? t`Are you sure you want to archive this event?`
            : t`Are you sure you want to restore this event? It will be restored as a draft event.`;

        confirmationDialog(message, () => {
            statusToggleMutation.mutate({
                eventId: event.id,
                status: event.status === 'ARCHIVED' ? 'DRAFT' : 'ARCHIVED'
            }, {
                onSuccess: () => {
                    showSuccess(t`Event status updated`);
                },
                onError: (error: unknown) => {
                    if (typeof error === 'object' && error !== null && 'response' in error) {
                        // @ts-expect-error: dynamic error shape
                        showError(error.response?.data?.message || t`Event status update failed. Please try again later`);
                    } else {
                        showError(t`Event status update failed. Please try again later`);
                    }
                }
            });
        })
    }

    const menuItems: ActionMenuItemsGroup[] = [
        {
            label: '',
            items: [
                // Only show admin controls for Event type
                ...('status' in event && 'lifecycle_status' in event ? [
                    {
                        label: t`View event page`,
                        icon: <IconEye size={14}/>,
                        onClick: () => window.location.href = eventHomepagePath(event as Event),
                    },
                    {
                        label: t`Manage event`,
                        icon: <IconSettings size={14}/>,
                        onClick: () => navigate(`/manage/event/${event.id}`),
                    },
                    (event.lifecycle_status === 'UPCOMING' || event.lifecycle_status === 'ONGOING') && event.status === 'LIVE' ? {
                        label: t`Check-in`,
                        icon: <IconQrcode size={14}/>,
                        onClick: () => navigate(`/manage/event/${event.id}/check-in`),
                        visible: true,
                    } : null,
                    {
                        label: t`Duplicate event`,
                        icon: <IconCopy size={14}/>,
                        onClick: () => handleDuplicate(event),
                    },
                    {
                        label: event.status === 'ARCHIVED' ? t`Restore event` : t`Archive event`,
                        icon: <IconArchive size={14}/>,
                        onClick: handleStatusToggle(event)
                    },
                ].filter(Boolean) : []),
                // For public events, only show duplicate (if needed)
                ...(!('status' in event) ? [
                    {
                        label: t`Duplicate event`,
                        icon: <IconCopy size={14}/>,
                        onClick: () => handleDuplicate(event),
                    }
                ] : []),
            ] as MenuItem[],
        },
    ];

    return (
        <>
            <Card className={classes.eventCard}>
                <div className={classes.cardHeader}>
                    <div className={classes.imageContainer}
                         style={coverImage ? {backgroundImage: `url(${coverImage.url})`} : {}}>
                        {!coverImage && (
                            <div className={classes.placeholderImage}>
                                <span className={classes.placeholderEmoji}>{placeholderEmoji}</span>
                            </div>
                        )}
                    </div>
                    <div className={classes.mainContent}>
                        <div className={classes.topRow}>
                            <NavLink to={`/manage/event/${event.id}/dashboard`} className={classes.titleLink}>
                                <h3 className={classes.eventTitle}>{event.title}</h3>
                            </NavLink>
                            {event && <EventStatusBadge event={event}/>}
                        </div>

                        <div className={classes.organizerWrapper}>
                        <span className={classes.organizerName}>
                            {'organizer' in event && event?.organizer?.name}
                        </span>
                        </div>

                        <div className={classes.dateTime}>
                            <div className={classes.dateBox}>
                                <span
                                    className={classes.month}>{formatDate(event.start_date, 'MMM', 'timezone' in event ? event.timezone ?? 'UTC' : 'UTC')}</span>
                                <span className={classes.day}>{formatDate(event.start_date, 'D', 'timezone' in event ? event.timezone ?? 'UTC' : 'UTC')}</span>
                            </div>
                            <div className={classes.timeInfo}>
                                <span
                                    className={classes.time}>{formatDate(event.start_date, t`h:mm A`, 'timezone' in event ? event.timezone ?? 'UTC' : 'UTC')}</span>
                                {event.end_date && (
                                    <span
                                        className={classes.endTime}>- {formatDate(event.end_date, t`h:mm A`, 'timezone' in event ? event.timezone ?? 'UTC' : 'UTC')}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={classes.actionContainer}>
                        <ActionMenu
                            itemsGroups={menuItems}
                            target={
                                <ActionIcon className={classes.actionButton} size={"lg"} variant={"subtle"}>
                                    <IconDotsVertical/>
                                </ActionIcon>
                            }
                        />
                    </div>
                </div>

                <div className={classes.cardFooter}>
                    <div className={classes.statsGrid}>
                        {/* Only show stats if available (for Event type) */}
                        {'settings' in event && event.settings?.location_details?.venue_name && (
                            <div className={classes.statItem}>
                                <IconMap size={14} className={classes.statIcon}/>
                                <span className={classes.statText}>
                                    {event.settings?.location_details?.venue_name}
                                </span>
                            </div>
                        )}
                        {'settings' in event && event.settings?.is_online_event && (
                            <div className={classes.statItem}>
                                <IconWorld size={14} className={classes.statIcon}/>
                                <span className={classes.statText}>{t`Online event`}</span>
                            </div>
                        )}
                        {'statistics' in event && (
                            <div className={classes.statItem}>
                                <IconUsers size={14} className={classes.statIcon}/>
                                <span
                                    className={classes.statValue}>{formatNumber(event?.statistics?.products_sold || 0)}</span>
                                <span className={classes.statLabel}>{t`sold`}</span>
                            </div>
                        )}
                        {'statistics' in event && (
                            <div className={classes.statItem}>
                                <IconCash size={14} className={classes.statIcon}/>
                                <span
                                    className={classes.statValue}>{formatCurrency(event?.statistics?.sales_total_gross || 0, event?.currency)}</span>
                            </div>
                        )}
                    </div>

                    <div className={classes.mobileActionWrapper}>
                        <ActionMenu
                            itemsGroups={menuItems}
                            target={
                                <Button
                                    variant="light"
                                    className={classes.manageButton}
                                    fullWidth
                                >
                                    {t`Manage Event`}
                                </Button>
                            }
                        />
                    </div>
                </div>
            </Card>
            {isDuplicateModalOpen && <DuplicateEventModal eventId={eventId} onClose={duplicateModal.close}/>}
        </>
    );
}
