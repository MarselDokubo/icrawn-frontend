import {Card} from "../../../common/Card";
import {useForm, UseFormReturnType} from "@mantine/form";
import {useGetMe} from "../../../../queries/useGetMe.ts";
import {Alert, Button, PasswordInput, Select, Tabs, TextInput} from "@mantine/core";
import classes from "./ManageProfile.module.scss";
import {useEffect, useState} from "react";
import {IconInfoCircle, IconPassword, IconUser} from "@tabler/icons-react";
import {timezones} from "../../../../../data/timezones.ts";
import {useUpdateMe} from "../../../../mutations/useUpdateMe.ts";
import {showError, showSuccess} from "../../../../utilites/notifications.tsx";
import {UserMeRequest} from "../../../../api/user.client.ts";
import {useCancelEmailChange} from "../../../../mutations/useCancelEmailChange.ts";
import {useFormErrorResponseHandler} from "../../../../hooks/useFormErrorResponseHandler.tsx";
import {t, Trans} from "@lingui/macro";
import {useResendEmailConfirmation} from "../../../../mutations/useResendEmailConfirmation.ts";
import {localeToFlagEmojiMap, SupportedLocales, getLocaleName} from "../../../../locales.ts";

export const ManageProfile = () => {
    const {data: me, isFetching} = useGetMe();
    const mutation = useUpdateMe();
    const cancelEmailChangeMutation = useCancelEmailChange();
    const resendEmailConfirmationMutation = useResendEmailConfirmation();
    const errorHandler = useFormErrorResponseHandler();
    const [emailConfirmationResent, setEmailConfirmationResent] = useState(false);
    const profileForm = useForm({
        initialValues: {
            first_name: me?.first_name,
            last_name: me?.last_name,
            email: me?.email,
            timezone: me?.timezone,
            locale: me?.locale,
        },
    });

    const passwordForm = useForm({
        initialValues: {
            current_password: '',
            password: '',
            password_confirmation: '',
        }
    });

    useEffect(() => {
        profileForm.setValues({
            first_name: me?.first_name,
            last_name: me?.last_name,
            email: me?.email,
            timezone: me?.timezone,
            locale: me?.locale,
        });
    }, [me]);

    const handleProfileFormSubmit = (formValues: Partial<UserMeRequest>, form: UseFormReturnType<any>) => {
        mutation.mutate({
            userData: formValues,
        }, {
            onSuccess: () => {
                form.reset();
                showSuccess(`Profile updated successfully`);
                document.cookie = `locale=${formValues.locale};path=/;max-age=31536000`;

                if (form.isDirty('locale')) {
                    window.location.reload();
                }
            },
            onError: (error: any) => {
                errorHandler(form, error);
            }
        })
    }

    const handleCancelEmailChange = () => {
        cancelEmailChangeMutation.mutate({
            userId: me?.id
        }, {
            onSuccess: () => {
                showSuccess(`Email change cancelled successfully`)
            },
            onError: () => {
                showError(`Something went wrong. Please try again.`)
            }
        })
    }

    const handleEmailConfirmationResend = () => {
        resendEmailConfirmationMutation.mutate({
            userId: me?.id
        }, {
            onSuccess: () => {
                showSuccess(`Email confirmation resent successfully`);
                setEmailConfirmationResent(true);
            },
            onError: () => {
                showError(`Something went wrong. Please try again.`);
            }
        })
    }

    return (
        <div className={classes.container}>
            <h1>{`Manage Profile`}</h1>
            <Card className={classes.tabsCard}>
                <Tabs defaultValue="profile">
                    <Tabs.List grow>
                        <Tabs.Tab value="profile" leftSection={<IconUser/>}>
                            {`Profile`}
                        </Tabs.Tab>
                        <Tabs.Tab value="password" leftSection={<IconPassword/>}>
                            {`Password`}
                        </Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="profile">
                        <div className={classes.tabWrapper}>
                            {me?.has_pending_email_change && (
                                <Alert className={classes.emailChangeAlert} variant="light" color="blue"
                                       title={`Email change pending`} icon={<IconInfoCircle/>}>
                                    <p>
                                        <Trans>Your email request change to <b>{me?.pending_email}</b> is pending.
                                            Please check your email to confirm</Trans>
                                    </p>
                                    <p>
                                        {`If you did not request this change, please immediately change your password.`}
                                    </p>
                                    <p>
                                        <Button onClick={handleCancelEmailChange} size={'xs'}>
                                            {`Cancel email change`}
                                        </Button>
                                    </p>
                                </Alert>
                            )}
                            <form
                                onSubmit={profileForm.onSubmit((values) => handleProfileFormSubmit(values, profileForm))}>
                                <fieldset disabled={isFetching}>
                                    <TextInput required {...profileForm.getInputProps('first_name')}
                                               label={`First Name`}/>
                                    <TextInput required {...profileForm.getInputProps('last_name')}
                                               label={`Last Name`}/>
                                    <TextInput required {...profileForm.getInputProps('email')} label={`Email`}/>
                                    {(me && !me.is_email_verified && !emailConfirmationResent) && (
                                        <Alert variant="light" mb={10}
                                               title={`Email not verified`} icon={<IconInfoCircle/>}>
                                            <p>{`Please verify your email address to access all features`}</p>
                                            <Button size={'xs'} onClick={handleEmailConfirmationResend}>
                                                {resendEmailConfirmationMutation.isPending ? `Resending...` : `Resend email confirmation`}
                                            </Button>
                                        </Alert>
                                    )}

                                    {emailConfirmationResent && (
                                        <Alert variant="light" mb={10} color="green"
                                               title={`Email confirmation resen`} icon={<IconInfoCircle/>}>
                                            <p>{`Please check your email to confirm your email address`}</p>
                                        </Alert>
                                    )}

                                    <Select
                                        required
                                        searchable
                                        data={timezones}
                                        {...profileForm.getInputProps('timezone')}
                                        label={`Timezone`}
                                        placeholder={`UTC`}
                                    />

                                    <Select
                                        required
                                        data={Object.keys(localeToFlagEmojiMap).map(locale => ({
                                            value: locale,
                                            label: localeToFlagEmojiMap[locale as SupportedLocales] + ' ' + getLocaleName(locale as SupportedLocales),
                                        }))}
                                        {...profileForm.getInputProps('locale')}
                                        label={`Language`}
                                        placeholder={`English`}
                                    />

                                    <Button fullWidth loading={mutation.isPending}
                                            type={'submit'}>{`Update profile`}</Button>
                                </fieldset>
                            </form>
                        </div>
                    </Tabs.Panel>

                    <Tabs.Panel value="password">
                        <div className={classes.tabWrapper}>
                            <form
                                onSubmit={passwordForm.onSubmit((values) => handleProfileFormSubmit(values, passwordForm))}>
                                <fieldset disabled={isFetching}>
                                    <PasswordInput
                                        required
                                        {...passwordForm.getInputProps('current_password')}
                                        label={`Current Password`}/>
                                    <PasswordInput
                                        required
                                        {...passwordForm.getInputProps('password')}
                                        label={`New Password`}/>
                                    <PasswordInput
                                        required
                                        {...passwordForm.getInputProps('password_confirmation')}
                                        label={`Confirm New Password`}/>
                                    <Button fullWidth loading={mutation.isPending}
                                            type={'submit'}>{`Change password`}</Button>
                                </fieldset>
                            </form>
                        </div>
                    </Tabs.Panel>
                </Tabs>
            </Card>
        </div>
    );
}

export default ManageProfile;
