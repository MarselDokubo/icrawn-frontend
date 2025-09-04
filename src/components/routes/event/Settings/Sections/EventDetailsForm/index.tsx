 
import {Button, Select, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useParams} from "react-router";
import {useGetEvent} from "../../../../../../queries/useGetEvent.ts";
import {useEffect} from "react";
import {useUpdateEvent} from "../../../../../../mutations/useUpdateEvent.ts";
import {Event} from "../../../../../../types.ts";
import {InputGroup} from "../../../../../common/InputGroup";
import {Card} from "../../../../../common/Card";
import {Editor} from "../../../../../common/Editor";
import {utcToTz} from "../../../../../../utilites/dates.ts";
import {showSuccess} from "../../../../../../utilites/notifications.tsx";
import {useFormErrorResponseHandler} from "../../../../../../hooks/useFormErrorResponseHandler.tsx";
import {currenciesMap} from "../../../../../../../data/currencies.ts";
import {timezones} from "../../../../../../../data/timezones.ts";
import {HeadingWithDescription} from "../../../../../common/Card/CardHeading";
import {EventCategories} from "../../../../../../constants/eventCategories.ts";

export const EventDetailsForm = () => {
    const {eventId} = useParams();
    const eventQuery = useGetEvent(eventId);
    const updateMutation = useUpdateEvent();
    const form = useForm({
        initialValues: {
            title: '',
            description: '',
            start_date: '',
            end_date: '',
            timezone: '',
            currency: '',
            category: '',
        }
    });
    const formErrorHandle = useFormErrorResponseHandler();

    useEffect(() => {
        if (eventQuery?.data) {
            form.setValues({
                title: eventQuery.data.title,
                description: eventQuery.data.description,
                start_date: utcToTz(eventQuery.data.start_date, eventQuery.data.timezone),
                end_date: utcToTz(eventQuery.data.end_date, eventQuery.data.timezone),
                timezone: eventQuery.data.timezone,
                currency: eventQuery.data.currency,
                category: eventQuery.data.category,
            });
        }
    }, [eventQuery.isFetched]);

    const handleSubmit = (values: Partial<Event>) => {
        updateMutation.mutate({
            eventData: values,
            eventId: eventId,
        }, {
            onSuccess: () => {
                showSuccess(`Successfully Updated Even`);
            },
            onError: (error) => {
                formErrorHandle(form, error);
            }
        });
    }

    return (
        <Card>
            <HeadingWithDescription
                heading={`Event Details`}
                description={`Update event name, description and dates`}
            />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <fieldset disabled={eventQuery.isLoading || updateMutation.isPending}>
                    <TextInput
                        {...form.getInputProps('title')}
                        label={`Name`}
                        placeholder={`Summer Music Festival ${new Date().getFullYear()}`}
                        required
                    />
                    
                    <Select
                        {...form.getInputProps('category')}
                        label={`Category`}
                        placeholder={`Select a category`}
                        data={EventCategories.map((category) => ({
                            value: category.id,
                            label: `${category.emoji} ${category.name}`,
                        }))}
                        searchable
                        clearable
                    />

                    <Editor
                        label={`Description`}
                        value={form.values.description || ''}
                        onChange={(value) => form.setFieldValue('description', value)}
                        error={form.errors?.description as string}
                    />

                    <InputGroup>
                        <TextInput type={'datetime-local'}
                                   {...form.getInputProps('start_date')}
                                   label={`Start Date`}
                                   required
                        />
                        <TextInput type={'datetime-local'}
                                   {...form.getInputProps('end_date')}
                                   label={`End Date`}
                        />
                    </InputGroup>
                    <InputGroup>
                        <Select
                            searchable
                            data={currenciesMap}
                            {...form.getInputProps('currency')}
                            label={`Currency`}
                            placeholder={`EUR`}
                            disabled
                        />

                        <Select
                            searchable
                            data={timezones}
                            {...form.getInputProps('timezone')}
                            label={`Timezone`}
                            placeholder={`UTC`}
                        />
                    </InputGroup>
                    <Button loading={updateMutation.isPending} type={'submit'}>
                        {`Save`}
                    </Button>
                </fieldset>
            </form>
        </Card>
    );
}
