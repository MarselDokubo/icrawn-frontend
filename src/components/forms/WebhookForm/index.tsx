import {TextInput} from "@mantine/core";
 
import {UseFormReturnType} from "@mantine/form";
import {CustomSelect, ItemProps} from "../../common/CustomSelect";
import {IconBolt, IconWebhook, IconWebhookOff} from "@tabler/icons-react";

interface WebhookFormProps {
    form: UseFormReturnType<{
        url: string;
        event_types: string[];
        status: 'ENABLED' | 'PAUSED';
    }>;
}

export const WebhookForm = ({form}: WebhookFormProps) => {
    const statusOptions: ItemProps[] = [
        {
            icon: <IconWebhook/>,
            label: `Enabled`,
            value: 'ENABLED',
            description: `Webhook will send notifications`,
        },
        {
            icon: <IconWebhookOff/>,
            label: `Paused`,
            value: 'PAUSED',
            description: `Webhook will not send notifications`,
        },
    ];

    const eventTypeOptions: ItemProps[] = [
        {
            icon: <IconBolt size={14}/>,
            label: `Product Created`,
            value: 'product.created',
            description: `When a new product is created`,
        },
        {
            icon: <IconBolt size={14}/>,
            label: `Product Updated`,
            value: 'product.updated',
            description: `When a product is updated`,
        },
        {
            icon: <IconBolt size={14}/>,
            label: `Product Deleted`,
            value: 'product.deleted',
            description: `When a product is deleted`,
        },
        {
            icon: <IconBolt size={14}/>,
            label: `Order Created`,
            value: 'order.created',
            description: `When a new order is created`,
        },
        {
            icon: <IconBolt size={14}/>,
            label: `Order Updated`,
            value: 'order.updated',
            description: `When an order is updated`,
        },
        {
            icon: <IconBolt size={14}/>,
            label: `Order Marked as Paid`,
            value: 'order.marked_as_paid',
            description: `When an order is marked as paid`,
        },
        {
            icon: <IconBolt size={14}/>,
            label: `Order Refunded`,
            value: 'order.refunded',
            description: `When an order is refunded`,
        },
        {
            icon: <IconBolt size={14}/>,
            label: `Order Cancelled`,
            value: 'order.cancelled',
            description: `When an order is cancelled`,
        },
        {
            icon: <IconBolt size={14}/>,
            label: `Attendee Created`,
            value: 'attendee.created',
            description: `When a new attendee is created`,
        },
        {
            icon: <IconBolt size={14}/>,
            label: `Attendee Updated`,
            value: 'attendee.updated',
            description: `When an attendee is updated`,
        },
        {
            icon: <IconBolt size={14}/>,
            label: `Attendee Cancelled`,
            value: 'attendee.cancelled',
            description: `When an attendee is cancelled`,
        },
        {
            icon: <IconBolt size={14}/>,
            label: `Check-in Created`,
            value: 'checkin.created',
            description: `When an attendee is checked in`,
        },
        {
            icon: <IconBolt size={14}/>,
            label: `Check-in Deleted`,
            value: 'checkin.deleted',
            description: `When a check-in is deleted`,
        },
    ];

    return (
        <>
            <TextInput
                {...form.getInputProps('url')}
                required
                label={`Webhook URL`}
                placeholder={`https://webhook-domain.com/webhook`}
            />

            <CustomSelect
                label={`Event Types`}
                description={`Select which events will trigger this webhook`}
                placeholder={`Select event types`}
                required
                form={form}
                name="event_types"
                optionList={eventTypeOptions}
                multiple
            />

            <CustomSelect
                label={`Status`}
                required
                form={form}
                name="status"
                optionList={statusOptions}
            />
        </>
    );
}
