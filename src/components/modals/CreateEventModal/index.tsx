import {useFormErrorResponseHandler} from "../../../hooks/useFormErrorResponseHandler.tsx";
import {useNavigate} from "react-router";
import {useGetAccount} from "../../../queries/useGetAccount.ts";
import {Event, GenericModalProps, IdParam, Organizer} from "../../../types.ts";
import {useEffect, useState} from "react";
 
import {Anchor, Button, Select, TextInput} from "@mantine/core";
import {hasLength, useForm} from "@mantine/form";
import {useCreateEvent} from "../../../mutations/useCreateEvent.ts";
import {Editor} from "../../common/Editor";
import {useGetOrganizers} from "../../../queries/useGetOrganizers.ts";
import {IconCalendarEvent, IconSparkles, IconUsers, IconX} from "@tabler/icons-react";
import classes from "./CreateEventModal.module.scss";
import {OrganizerCreateForm} from "../../forms/OrganizerForm";
import dayjs from "dayjs";
import {DateTimePicker} from "@mantine/dates";
import {EventCategories} from "../../../constants/eventCategories.ts";

interface CreateEventModalProps extends GenericModalProps {
    organizerId?: IdParam;
}
const placeholderDate = new Date().getFullYear();
export const CreateEventModal = ({onClose, organizerId}: CreateEventModalProps) => {
    const errorHandler = useFormErrorResponseHandler();
    const navigate = useNavigate();
    const {data: account, isFetched: isAccountFetched} = useGetAccount();
    const organizersQuery = useGetOrganizers();

    const form = useForm<Partial<Event>>({
        initialValues: {
            title: '',
            status: undefined,
            start_date: dayjs().add(1, 'day').hour(21).minute(0).second(0).toISOString(),
            end_date: undefined,
            description: undefined,
            organizer_id: organizerId ? String(organizerId) : undefined,
            category: undefined,
        },
        validate: {
            title: hasLength({max: 150}, `Event name should be less than 150 characters`),
            end_date: (value, values) => {
                if (value && values.start_date && dayjs(value).isBefore(dayjs(values.start_date))) {
                    return `End date must be after start date`;
                }
            },
            organizer_id: (value) => {
                if (!value) {
                    return `Organizer is required`;
                }
            },
        },
        validateInputOnChange: true,
    });
    const eventMutation = useCreateEvent();
    const [showCreateOrganizer, setShowCreateOrganizer] = useState(false);

    // If organizerId is provided, set it and fetch the organizer data
    useEffect(() => {
        if (organizerId) {
            form.setFieldValue('organizer_id', String(organizerId));
        }
    }, [organizerId, form]);

    useEffect(() => {
        if (organizersQuery.isFetched && organizersQuery.data?.data?.length === 1) {
            form.setFieldValue('organizer_id', String(organizersQuery.data?.data[0].id));
        }
    }, [organizersQuery.isFetched, form, organizersQuery.data?.data]);

    useEffect(() => {
        if (isAccountFetched) {
            form.setFieldValue('currency', account?.currency_code);
            form.setFieldValue('timezone', account?.timezone);
        }
    }, [isAccountFetched, account?.currency_code, account?.timezone, form]);

    useEffect(() => {
        if (form.values.organizer_id && organizersQuery.data) {
            form.setFieldValue(
                'currency',
                organizersQuery.data.data
                    .find((organizer) => organizer.id === Number(form.values.organizer_id))?.currency);
        }
    }, [form.values.organizer_id, form, organizersQuery.data]);

    const handleCreate = (values: Partial<Event>) => {
        eventMutation.mutateAsync({
            eventData: values,
        }).then((data) => {
            navigate(`/manage/event/${data.data.id}/getting-started?new_event=true`)
        }).catch((error) => {
            errorHandler(form, error);
        });
    }

    return (
        <div className={classes.modalOverlay} onClick={onClose}>
            {/* Floating background emojis */}
            <div className={classes.floatingEmojis}>
                <span className={classes.floatingEmoji} style={{top: '10%', left: '15%', animationDelay: '0s'}}>🎉</span>
                <span className={classes.floatingEmoji}
                      style={{top: '20%', right: '20%', animationDelay: '2s'}}>✨</span>
                <span className={classes.floatingEmoji} style={{top: '60%', left: '10%', animationDelay: '4s'}}>🥳</span>
                <span className={classes.floatingEmoji}
                      style={{bottom: '30%', right: '15%', animationDelay: '1s'}}>🎪</span>
                <span className={classes.floatingEmoji}
                      style={{bottom: '15%', left: '25%', animationDelay: '3s'}}>🌟</span>
                <span className={classes.floatingEmoji} style={{top: '40%', right: '8%', animationDelay: '5s'}}>🎭</span>
                <span className={classes.floatingEmoji}
                      style={{top: '70%', left: '70%', animationDelay: '2.5s'}}>🎨</span>
                <span className={classes.floatingEmoji}
                      style={{top: '25%', left: '60%', animationDelay: '1.5s'}}>🎯</span>
            </div>

            <div className={classes.modalContainer} onClick={(e) => e.stopPropagation()}>
                <button
                    className={classes.closeButton}
                    onClick={onClose}
                    aria-label={`Close modal`}
                >
                    <IconX size={20}/>
                </button>

                <div className={classes.modalHeader}>
                    <div className={classes.headerContent}>
                        <div className={classes.magicWand}>✨</div>
                        <h1 className={classes.headerTitle}>{`Create Your Event`}</h1>
                        <p className={classes.headerSubtitle}>{`Tell us about your Event`}</p>
                    </div>
                </div>

                <div className={classes.modalContent}>
                    <div className={classes.formContainer}>
                        {showCreateOrganizer && (
                            <div className={classes.createOrganizerCard}>
                                <h3 className={classes.createOrganizerHeading}>
                                    <IconUsers size={20}/>
                                    {`Create Organizer`}
                                </h3>
                                <OrganizerCreateForm
                                    onCancel={() => setShowCreateOrganizer(false)}
                                    onSuccess={(organizer: Organizer) => {
                                        setShowCreateOrganizer(false);
                                        form.setFieldValue('organizer_id', String(organizer.id));
                                    }}/>
                            </div>
                        )}

                        {!showCreateOrganizer && !organizerId && (
                            <>
                                <Select
                                    {...form.getInputProps('organizer_id')}
                                    label={`Who is organizing this event?`}
                                    required
                                    leftSection={<IconUsers size={18}/>}
                                    placeholder={`Select organizer`}
                                    data={organizersQuery.data?.data?.map((organizer) => ({
                                        value: String(organizer.id),
                                        label: organizer.name,
                                    }))}
                                    mb={0}
                                />
                                <div className={classes.createOrganizerLink}>
                                    {`or`} {'  '}
                                    <Anchor href={'#'} variant={'transparent'}
                                            onClick={() => setShowCreateOrganizer(true)}>
                                        {`create an organizer`}
                                    </Anchor>
                                </div>
                            </>
                        )}

                        <form onSubmit={form.onSubmit(handleCreate)}>
                            <TextInput
                                {...form.getInputProps('title')}
                                label={`Event Name`}
                                placeholder={`Summer Music Festival ${placeholderDate}`}
                                required
                                size="lg"
                                leftSection={<IconSparkles size={18}/>}
                            />

                            <Select
                                {...form.getInputProps('category')}
                                label={`Event Category`}
                                placeholder={`Select a category`}
                                data={EventCategories.map((category) => ({
                                    value: category.id,
                                    label: `${category.emoji} ${category.name}`,
                                }))}
                                size="lg"
                                searchable
                            />

                            <div className={classes.editorField}>
                                <Editor
                                    label={`Event Description`}
                                    description={`Tell people what to expect at your Event`}
                                    value={form.values.description || ''}
                                    onChange={(value) => form.setFieldValue('description', value)}
                                    error={form.errors.description as string}
                                    editorType="simple"
                                    maxLength={2000}
                                    size="lg"
                                />
                            </div>

                            <div className={classes.dateTimeGrid}>
                                <DateTimePicker
                                    label={`Start Date & Time`}
                                    {...form.getInputProps('start_date')}
                                    required
                                    size="md"
                                    placeholder={`Select start date and time`}
                                    valueFormat={`MMM DD, YYYY [at] h:mm A`}
                                    clearable
                                    dropdownType="modal"
                                    timePickerProps={{
                                        format: '12h',
                                        withDropdown: true,
                                    }}
                                    onChange={(value) => {
                                        if (value !== null) {
                                            form.setFieldValue('start_date', value);
                                        }

                                        // Auto-adjust end date if it's before new start date
                                        if (form.values.end_date && value && dayjs(form.values.end_date).isBefore(dayjs(value))) {
                                            form.setFieldValue('end_date', dayjs(value).add(2, 'hours').toISOString());
                                        }
                                    }}
                                />
                                <DateTimePicker
                                    label={`End Date & Time (optional)`}
                                    {...form.getInputProps('end_date')}
                                    size="md"
                                    placeholder={`Select end date and time`}
                                    valueFormat={`MMM DD, YYYY [at] h:mm A`}
                                    clearable
                                    dropdownType="modal"
                                    timePickerProps={{
                                        format: '12h',
                                        withDropdown: true,
                                    }}
                                    minDate={form.values.start_date ?? undefined}
                                    onFocus={
                                        () => {
                                            if (!form.values.end_date && form.values.start_date) {
                                                // Set default end date to 2 hours after start date
                                                form.setFieldValue('end_date', dayjs(form.values.start_date).add(2, 'hours').toISOString());
                                            }
                                        }
                                    }

                                />
                            </div>

                            <Button
                                loading={eventMutation.isPending}
                                fullWidth
                                type={'submit'}
                                size="xl"
                                className={classes.createButton}
                                leftSection={<IconCalendarEvent size={24}/>}
                            >
                                {`Continue Setup`}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
