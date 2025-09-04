import {Button, PasswordInput, SimpleGrid, TextInput} from "@mantine/core";
import {hasLength, isEmail, matchesField, useForm} from "@mantine/form";
import {RegisterAccountRequest} from "../../../../types.ts";
import {useFormErrorResponseHandler} from "../../../../hooks/useFormErrorResponseHandler.tsx";
import {useRegisterAccount} from "../../../../mutations/useRegisterAccount.ts";
import {NavLink, useLocation, useNavigate} from "react-router";
import {t, Trans} from "@lingui/macro";
import classes from "./Register.module.scss";
import {getClientLocale} from "../../../../locales.ts";
import {useEffect} from "react";
import {getUserCurrency} from "../../../../utilites/currency.ts";
import { getConfig } from "../../../../utilites/config.ts";
import type { AxiosError } from "axios";

function isAxiosError(error: unknown): error is AxiosError {
    return typeof error === "object" && error !== null && "isAxiosError" in error;
}

export const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const appName = getConfig("VITE_APP_NAME", `iCrawn.Events`) || `iCrawn.Events`;

    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            timezone: typeof window !== 'undefined'
                ? Intl.DateTimeFormat().resolvedOptions().timeZone
                : 'UTC',
            locale: getClientLocale(),
            invite_token: '',
            currency_code: getUserCurrency(),
        },
        validate: {
            password: hasLength({min: 8}, `Password must be at least 8 characters`),
            password_confirmation: matchesField('password', `Passwords are not the same`),
            email: isEmail(`Please check your email is valid`),
        },
    });
    const errorHandler = useFormErrorResponseHandler();
    const mutate = useRegisterAccount();

    const registerUser = (data: RegisterAccountRequest) => {
        mutate.mutate({registerData: data}, {
            onSuccess: () => {
                navigate('/welcome');
            },
            onError: (error: unknown) => {
                let message: string | undefined = undefined;
                if (
                    isAxiosError(error) &&
                    error.response?.data &&
                    typeof (error.response.data as { message?: unknown }).message === "string"
                ) {
                    message = (error.response.data as { message: string }).message;
                }
                errorHandler(form, error, message);
            },
        });
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('invite_token');

        if (token) {
            form.setFieldValue('invite_token', token);
        }
    }, [location.search, form]);

    return (
        <>
            <header className={classes.header}>
                <h2>{`Welcome to ${appName} 👋`}</h2>
                <p>
                    <Trans>
                        Create an account or <NavLink to={'/auth/login'}>
                        {`Log in`}
                    </NavLink> to get started
                    </Trans>
                </p>
            </header>

            <div className={classes.registerCard}>
                <form onSubmit={form.onSubmit((values) => registerUser(values as RegisterAccountRequest))}>

                    <SimpleGrid verticalSpacing={0} cols={{base: 2, xs: 2}}>
                        <TextInput
                            {...form.getInputProps('first_name')}
                            label={`First Name`}
                            placeholder={`John`}
                            required
                        />
                        <TextInput
                            {...form.getInputProps('last_name')}
                            label={`Last Name`}
                            placeholder={`Smith`}
                        />
                    </SimpleGrid>

                    <TextInput
                        mb={0}
                        {...form.getInputProps('email')}
                        label={`Email`}
                        placeholder={'your@email.com'}
                        required
                    />

                    <div style={{marginBottom: '20px'}}>
                        <SimpleGrid verticalSpacing={0} cols={{base: 2, xs: 2}}>
                            <PasswordInput
                                {...form.getInputProps('password')}
                                label={`Password`}
                                placeholder={`Your password`}
                                required
                                mt="md"
                                mb={0}
                            />
                            <PasswordInput
                                {...form.getInputProps('password_confirmation')}
                                label={`Confirm Password`}
                                placeholder={`Confirm password`}
                                required
                                mt="md"
                                mb={0}
                            />
                        </SimpleGrid>
                    </div>

                    <TextInput
                        style={{display: 'none'}}
                        {...form.getInputProps('timezone')}
                        type="hidden"
                    />
                    <Button color={'var(--hi-pink)'} type="submit" fullWidth disabled={mutate.isPending}>
                        {mutate.isPending ? `Working...` : `Register`}
                    </Button>
                </form>
                <footer>
                    <Trans>
                        By registering you agree to our <NavLink target={'_blank'}
                                                                 to={getConfig("VITE_TOS_URL", "https://iCrawn.Events/terms-of-service?utm_source=app-register-footer") as string}>Terms
                        of Service</NavLink> and <NavLink
                        target={'_blank'}
                        to={getConfig("VITE_PRIVACY_URL", 'https://iCrawn.Events/privacy-policy?utm_source=app-register-footer') as string}>Privacy Policy</NavLink>.
                    </Trans>
                </footer>
            </div>
        </>
    )
}

export default Register;
