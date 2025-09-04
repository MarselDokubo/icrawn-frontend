import {modals} from "@mantine/modals";
import {t} from "@lingui/macro";

export const confirmationDialog = (
    message: string,
    onConfirm: () => void,
    labels?: { confirm: string; cancel: string },
) => {
    modals.openConfirmModal({
        title: message,
        labels: labels || {confirm: `Confirm`, cancel: `Cancel`},
        onConfirm: () => onConfirm(),
    });
}