import {useGetMe} from "../../../queries/useGetMe.ts";
import {useGetOrganizers} from "../../../queries/useGetOrganizers.ts";
import {t, Trans} from "@lingui/macro";
import {Card} from "../../common/Card";
import {Button, Center, Container, PinInput, Select, Stack, Text, TextInput} from "@mantine/core";
import classes from "./Welcome.module.scss";
import {useForm} from "@mantine/form";
import {useDebouncedValue, useMediaQuery} from "@mantine/hooks";
import {useCreateEvent} from "../../../mutations/useCreateEvent.ts";
import {NavLink, useNavigate} from "react-router";
import {useCallback, useEffect, useState} from "react";
import {useGetEvents} from "../../../queries/useGetEvents.ts";
import {LoadingContainer} from "../../common/LoadingContainer";
import {OrganizerCreateForm} from "../../forms/OrganizerForm";
import {useConfirmEmailWithCode} from "../../../mutations/useConfirmEmailWithCode.ts";
import {useResendEmailConfirmation} from "../../../mutations/useResendEmailConfirmation.ts";
import {IconClock, IconMailCheck, IconSparkles} from "@tabler/icons-react";
import {showError, showSuccess} from "../../../utilites/notifications.tsx";
import {DateTimePicker} from "@mantine/dates";
import dayjs from "dayjs";
import {EventCategories} from "../../../constants/eventCategories.ts";
import {getConfig} from "../../../utilites/config.ts";

export const CreateOrganizer = ({progressInfo}: {
    progressInfo?: { currentStep: number, totalSteps: number, progressPercentage: number }
}) => {
    return (
        <div className={classes.stepContainer}>
            <div className={classes.stepHeader}>
                {progressInfo && (
                    <div className={classes.progressContainer}>
                        <div className={classes.progressBar}>
                            <div className={classes.progressFill}
                                 style={{width: `${progressInfo.progressPercentage}%`}}></div>
                        </div>
                    </div>
                )}
                <h2 className={classes.stepTitle}>
                    {`Set up your organization`}
                </h2>
                <p className={classes.stepDescription}>
                    {`Tell us about your organization. This information will be displayed on your event pages.`}
                </p>
            </div>
            <div className={classes.stepContent}>
                <OrganizerCreateForm/>
            </div>
        </div>
    );
}

const ConfirmVerificationPin = ({progressInfo}: {
    progressInfo: { currentStep: number, totalSteps: number, progressPercentage: number }
}) => {
    const {data: userData} = useGetMe();
    const confirmEmailMutation = useConfirmEmailWithCode();
    const resendMutation = useResendEmailConfirmation();
    const [resendCooldown, setResendCooldown] = useState(0);
    const [completedPin, setCompletedPin] = useState('');
    const isMobile = useMediaQuery(`(max-width: 768px)`);

    const form = useForm({
        initialValues: {
            pin: '',
        },
        validate: {
            pin: (value) => value.length !== 5 ? `Please enter the 5-digit code` : null,
        }
    });

    // Debounce the completed pin value
    const [debouncedPin] = useDebouncedValue(completedPin, 800);
    const handleSubmit = useCallback((values: { pin: string }) => {
        confirmEmailMutation.mutate({
            userId: userData?.id || '',
            code: values.pin,
        }, {
            onSuccess: () => {
                showSuccess(`Email verified successfully!`);
                form.reset();
                setCompletedPin('');
            },
            onError: (error) => {
                const err = error as { response?: { data?: { message?: string } } };
                showError(err.response?.data?.message || `Failed to verify email`);
                form.reset();
                setCompletedPin('');
            }
        });
    }, [confirmEmailMutation, userData?.id, form, setCompletedPin]);
    // Auto-submit when debounced pin is complete
    useEffect(() => {
        if (debouncedPin.length === 5 && !confirmEmailMutation.isPending) {
            handleSubmit({pin: debouncedPin});
        }
    }, [debouncedPin, confirmEmailMutation.isPending, handleSubmit]);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);



    const handleResend = async () => {
        if (!userData?.id) return;

        try {
            await resendMutation.mutateAsync({userId: userData.id});
            showSuccess(`A new verification code has been sent to your email`);
            setResendCooldown(30);
            form.reset();
        } catch (error) {
                const err = error as { response?: { status?: number; data?: { message?: string } } };
                if (err?.response?.status === 429) {
                    const remainingSeconds = err.response.data?.message?.match(/\d+/)?.[0] || 30;
                    setResendCooldown(parseInt(remainingSeconds as string));
                    showError(err.response.data?.message || `Please wait before requesting another code`);
                } else {
                    showError(`Failed to resend verification code`);
                }
        }
    }

    return (
        <div className={classes.stepContainer}>
            <div className={classes.stepHeader}>
                {progressInfo && (
                    <div className={classes.progressContainer}>
                        <div className={classes.progressBar}>
                            <div className={classes.progressFill}
                                 style={{width: `${progressInfo.progressPercentage}%`}}></div>
                        </div>
                    </div>
                )}
                <h2 className={classes.stepTitle}>
                    {`Check your email`}
                </h2>
                <p className={classes.stepDescription}>
                    {`We've sent a 5-digit verification code to:`}
                </p>
                <div className={classes.emailDisplay}>
                    {userData?.email}
                </div>
            </div>

            <div className={classes.stepContent}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap={32}>
                        <Center>
                            <PinInput
                                {...form.getInputProps('pin')}
                                inputMode={'numeric'}
                                aria-label={`Verification code`}
                                size={isMobile ? 'sm' : 'xl'}
                                length={5}
                                placeholder="•"
                                type="number"
                                disabled={confirmEmailMutation.isPending}
                                error={!!form.errors.pin}
                                className={classes.pinInput}
                                gap={isMobile ? 8 : "sm"}
                                onChange={(value) => {
                                    form.setFieldValue('pin', value);
                                    if (value.length === 5) {
                                        setCompletedPin(value);
                                    } else {
                                        setCompletedPin('');
                                    }
                                }}
                            />
                        </Center>

                        <Button
                            type={'submit'}
                            fullWidth
                            size="lg"
                            loading={confirmEmailMutation.isPending}
                            leftSection={<IconMailCheck size={20}/>}
                            className={classes.primaryButton}
                        >
                            {confirmEmailMutation.isPending ? `Verifying...` : `Verify Email`}
                        </Button>

                        <Center>
                            <Stack gap="xs" align="center">
                                <Text size="sm" c="dimmed">
                                    {`Didn't receive the code?`}
                                </Text>
                                <Button
                                    variant="subtle"
                                    size="sm"
                                    onClick={handleResend}
                                    disabled={resendCooldown > 0 || resendMutation.isPending}
                                    loading={resendMutation.isPending}
                                    leftSection={resendCooldown > 0 ? <IconClock size={16}/> : null}
                                >
                                    {resendCooldown > 0
                                        ? `Resend in ${resendCooldown}s`
                                        : `Resend code`}
                                </Button>
                            </Stack>
                        </Center>

                        <Text size="xs" c="dimmed" ta="center" className={classes.helpText}>
                            {`The code will expire in 10 minutes. Check your spam folder if you don't see the email.`}
                        </Text>
                    </Stack>
                </form>
            </div>
        </div>
    );
}

export const CreateEvent = ({progressInfo}: {
    progressInfo?: { currentStep: number, totalSteps: number, progressPercentage: number }
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const form = useForm({
        initialValues: {
            title: '',
            start_date: dayjs().add(1, 'day').hour(19).minute(0).second(0).toDate(),
            end_date: dayjs().add(1, 'day').hour(21).minute(0).second(0).toDate(),
            category: '',
        },
        validate: {
            title: (value) => !value ? `Event name is required` : null,
            start_date: (value) => !value ? `Start date is required` : null,
            end_date: (value, values) => {
                if (value && values.start_date && dayjs(value).isBefore(dayjs(values.start_date))) {
                    return `End date must be after start date`;
                }
            },
        }
    });
    const eventMutation = useCreateEvent();
    const navigate = useNavigate();
    const {data: organizers, isFetched: organizersFetched} = useGetOrganizers();
    const {data: events, isFetched: eventsFetched} = useGetEvents({
        pageNumber: 1,
    });

    const handleSubmit = (values: { title: string; start_date: Date; end_date: Date; category: string; }) => {
        const submitData = {
            ...values,
            start_date: values.start_date ? dayjs(values.start_date).toISOString() : undefined,
            end_date: values.end_date ? dayjs(values.end_date).toISOString() : undefined,
        };

        eventMutation.mutate({
            eventData: submitData,
        }, {
            onSuccess: (values) => {
                navigate(`/manage/event/${values.data.id}/getting-started?new_event=true`)
            }
        });
    }

    useEffect(() => {
        if (organizersFetched) {
            const organizerName = organizers?.data?.[0].name ?? '';
            form.setFieldValue('organizer_id', organizers?.data?.[0].id);
            form.setFieldValue('title', `${organizerName}'s first Event`);
        }
    }, [organizersFetched, form, organizers?.data]);

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId);
        form.setFieldValue('category', categoryId);

        // Add haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    };

    useEffect(() => {
        if (eventsFetched && events && events.data.length > 0) {
            navigate(`/manage/events`);
        }
    }, [eventsFetched, events, navigate]);

    return (
        <LoadingContainer>
            <div className={classes.stepContainer}>
                <div className={classes.stepHeader}>
                    {progressInfo && (
                        <div className={classes.progressContainer}>
                            <div className={classes.progressBar}>
                                <div className={classes.progressFill}
                                     style={{width: `${progressInfo.progressPercentage}%`}}></div>
                            </div>
                        </div>
                    )}
                    <h2 className={classes.stepTitle}>
                        {`Create your first Event`}
                    </h2>
                </div>

                <div className={classes.stepContent}>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack gap={24}>
                            {/* Event Category */}
                            <div>
                                <Text size="lg" fw={600} mb="lg">{`What type of event?`}</Text>

                                {/* Desktop Grid */}
                                <div className={classes.categoryGrid}>
                                    {EventCategories.map((category) => (
                                        <button
                                            key={category.id}
                                            type="button"
                                            className={`${classes.categoryCard} ${
                                                selectedCategory === category.id ? classes.categoryCardSelected : ''
                                            }`}
                                            onClick={() => handleCategorySelect(category.id)}
                                            disabled={eventMutation.isPending}
                                        >
                                            <div className={classes.categoryEmoji}>{category.emoji}</div>
                                            <div className={classes.categoryText}>{category.name}</div>
                                        </button>
                                    ))}
                                </div>

                                {/* Mobile Dropdown */}
                                <div className={classes.categoryDropdown}>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(value) => handleCategorySelect(value || '')}
                                        data={EventCategories.map((category) => ({
                                            value: category.id,
                                            label: `${category.emoji} ${category.name}`,
                                        }))}
                                        placeholder={`Select event category`}
                                        size="lg"
                                        required
                                        disabled={eventMutation.isPending}
                                    />
                                </div>
                            </div>

                            {/* Event Name */}
                            <div>
                                <TextInput
                                    {...form.getInputProps('title')}
                                    label={`Event name`}
                                    placeholder={`Summer Music Festival 2025`}
                                    size="lg"
                                    required
                                    disabled={eventMutation.isPending}
                                />
                            </div>

                            {/* Date & Time */}
                            <div className={classes.dateTimeGrid}>
                                <DateTimePicker
                                    {...form.getInputProps('start_date')}
                                    label={`Start date & time`}
                                    placeholder={`Select start time`}
                                    valueFormat={`MMM DD, h:mm A`}
                                    size="lg"
                                    required
                                    dropdownType="modal"
                                    timePickerProps={{
                                        format: '12h',
                                        withDropdown: true,
                                    }}
                                    onChange={(value) => {
                                        if (Object.prototype.toString.call(value) === '[object Date]' && value) {
                                            let dateValue;
                                            if (typeof value === 'string') {
                                                dateValue = new Date(value);
                                            }
                                            form.setFieldValue('start_date', dateValue as Date);
                                            if (form.values.end_date && dayjs(form.values.end_date).isBefore(dayjs(value))) {
                                                form.setFieldValue('end_date', dayjs(value).add(2, 'hours').toDate());
                                            }
                                        }
                                    }}
                                    disabled={eventMutation.isPending}
                                />

                                <DateTimePicker
                                    {...form.getInputProps('end_date')}
                                    label={`End time (optional)`}
                                    placeholder={`Select end time`}
                                    valueFormat={`MMM DD, h:mm A`}
                                    size="lg"
                                    dropdownType="modal"
                                    timePickerProps={{
                                        format: '12h',
                                        withDropdown: true,
                                    }}
                                    minDate={form.values.start_date ?? undefined}
                                    date={form.values.start_date ?? undefined}
                                    disabled={eventMutation.isPending}
                                />
                            </div>
                        </Stack>
                        <Button
                            type={'submit'}
                            fullWidth
                            size="lg"
                            loading={eventMutation.isPending}
                            leftSection={eventMutation.isPending ? null : <IconSparkles size={20}/>}
                            className={classes.primaryButton}
                            disabled={eventMutation.isPending || !selectedCategory}
                            aria-label={eventMutation.isPending ? `Creating your event, please wai` : `Continue to next step`}
                        >
                            {eventMutation.isPending ? `Creating Event...` : `Continue Setup`}
                        </Button>
                    </form>
                </div>
            </div>
        </LoadingContainer>
    );
}

// Helper function to get progress information
const getProgressInfo = (requiresVerification: boolean, currentStep: 'verification' | 'organizer' | 'event') => {
    const totalSteps = requiresVerification ? 3 : 2;
    let currentStepNumber = 1;

    if (requiresVerification) {
        if (currentStep === 'verification') currentStepNumber = 1;
        else if (currentStep === 'organizer') currentStepNumber = 2;
        else if (currentStep === 'event') currentStepNumber = 3;
    } else {
        if (currentStep === 'organizer') currentStepNumber = 1;
        else if (currentStep === 'event') currentStepNumber = 2;
    }

    const progressPercentage = (currentStepNumber / totalSteps) * 100;

    return {
        currentStep: currentStepNumber,
        totalSteps,
        progressPercentage
    };
};

const Welcome = () => {
    const {data: userData} = useGetMe();
    const organizersQuery = useGetOrganizers();
    const organizers = organizersQuery?.data?.data;
    const organizerExists = !!(organizersQuery.isFetched && organizers?.length && organizers.length > 0);

    const requiresVerification = Boolean(userData
        && userData.enforce_email_confirmation_during_registration
        && !userData.is_email_verified);

    return (
        <div className={classes.welcomeContainer}>
            <Container size="sm" className={classes.welcomeContent}>
                <div className={classes.welcomeHeader}>
                    <div className={classes.logo}>
                        <img src="/icrawn_logo.jpg" alt="iCrawn.Events"/>
                    </div>
                    <h1 className={classes.welcomeTitle}>
                        <>
                            Welcome to {getConfig("VITE_APP_NAME", `iCrawn.Events`)}, {userData?.first_name} 👋
                        </>
                    </h1>
                </div>

                <Card className={classes.welcomeCard}>
                    {requiresVerification && <ConfirmVerificationPin
                        progressInfo={getProgressInfo(requiresVerification, 'verification')}/>} 
                    {(!requiresVerification && organizerExists) &&
                        <CreateEvent progressInfo={getProgressInfo(requiresVerification, 'event')}/>} 
                    {(!requiresVerification && !organizerExists) && <CreateOrganizer
                        progressInfo={getProgressInfo(requiresVerification, 'organizer')}/>} 
                </Card>

                {(!requiresVerification && organizerExists) && (
                    <Center className={classes.skipSection}>
                        <Button
                            component={NavLink}
                            to={'/manage/events'}
                            variant="subtle"
                            size="sm"
                            c="dimmed"
                        >
                            {`Skip this step`}
                        </Button>
                    </Center>
                )}
            </Container>
        </div>
    )
}

export default Welcome;
