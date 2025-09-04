import React, {useCallback} from 'react';
import {Button} from '@mantine/core';
import {IconEye} from '@tabler/icons-react';
import {t} from '@lingui/macro';
import {showError, showSuccess} from '../../../utilites/notifications';
import {confirmationDialog} from '../../../utilites/confirmationDialog';
import {useUpdateEventStatus} from '../../../mutations/useUpdateEventStatus';
import {useUpdateOrganizerStatus} from '../../../mutations/useUpdateOrganizerStatus';
import {IdParam} from '../../../types';
import classes from './StatusToggle.module.scss';

interface StatusToggleProps {
    entityType: 'event' | 'organizer';
    entityId: IdParam;
    currentStatus: 'DRAFT' | 'LIVE';
    entityName?: string;
    onSuccess?: () => void;
}

export const StatusToggle: React.FC<StatusToggleProps> = ({
                                                              entityType,
                                                              entityId,
                                                              currentStatus,
    onSuccess,
                                                          }) => {
    const eventStatusMutation = useUpdateEventStatus();
    const organizerStatusMutation = useUpdateOrganizerStatus();
    const mutation = entityType === 'event' ? eventStatusMutation : organizerStatusMutation;

    const handleToggle = useCallback(() => {
        const isDraft = currentStatus === 'DRAFT';
        const newStatus = isDraft ? 'LIVE' : 'DRAFT';

        // Confirmation messages
        const confirmMessage = isDraft
            ? entityType === 'event'
                ? `Are you sure you want to publish this event? Once published, it will be visible to the public.`
                : `Are you sure you want to publish this organizer profile? Once published, it will be visible to the public.`
            : entityType === 'event'
                ? `Are you sure you want to unpublish this event? It will no longer be visible to the public.`
                : `Are you sure you want to unpublish this organizer profile? It will no longer be visible to the public.`;

        confirmationDialog(confirmMessage, () => {
            const mutationParams = entityType === 'event'
                ? {eventId: entityId, status: newStatus}
                : {organizerId: entityId, status: newStatus};

            mutation.mutate(mutationParams as any, {
                onSuccess: () => {
                    const successMessage = entityType === 'event'
                        ? `Event status updated`
                        : `Organizer status updated`;
                    showSuccess(successMessage);
                    onSuccess?.();
                },
                onError: (error: any) => {
                    const errorMessage = error?.response?.data?.message ||
                        (entityType === 'event'
                            ? `Event status update failed. Please try again later`
                            : `Organizer status update failed. Please try again later`);
                    showError(errorMessage);
                }
            });
        });
    }, [
        entityType,
        entityId,
        currentStatus,
        mutation
    ]);

    // Don't show toggle if already live
    if (currentStatus === 'LIVE') {
        return null;
    }

    const message = entityType === 'event'
        ? `This event is not published ye`
        : `This organizer profile is not published ye`;

    return (
        <div className={classes.banner}>
            <div className={classes.content}>
                <span className={classes.message}>{message}</span>
                <Button
                    onClick={handleToggle}
                    loading={mutation.isPending}
                    size="xs"
                    variant="white"
                    leftSection={<IconEye size={14}/>}
                    className={classes.publishButton}
                >
                    {`Publish`}
                </Button>
            </div>
        </div>
    );
};
