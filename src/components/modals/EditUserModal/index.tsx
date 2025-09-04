import {useForm} from "@mantine/form";
import {GenericModalProps, User,} from "../../../types.ts";
import {Modal} from "../../common/Modal";
import {Alert, Button, Select, TextInput} from "@mantine/core";
import {useFormErrorResponseHandler} from "../../../hooks/useFormErrorResponseHandler.tsx";
import {t, Trans} from "@lingui/macro";
import {CustomSelect, ItemProps} from "../../common/CustomSelect";
import {IconUser, IconUserShield} from "@tabler/icons-react";
import {showSuccess} from "../../../utilites/notifications.tsx";
import {UpdateUserRequest} from "../../../api/user.client.ts";
import {useEditUser} from "../../../mutations/useEditUser.ts";
import {NavLink} from "react-router";
import {InputGroup} from "../../common/InputGroup";

interface EditUserModalProps extends GenericModalProps {
    user: User;
}

export const EditUserModal = ({onClose, user}: EditUserModalProps) => {
    const ediMutation = useEditUser();
    const formErrorHandler = useFormErrorResponseHandler();

    const form = useForm<UpdateUserRequest>({
        initialValues: {
            first_name: user.first_name,
            last_name: user.last_name,
            status: String(user.status),
            role: String(user.role),
        },
    });

    const handleCreate = (values: UpdateUserRequest) => {
        ediMutation.mutate({
            userId: user.id,
            userData: values,
        }, {
            onSuccess: () => {
                form.reset();
                onClose();
                showSuccess(<>Success! {values.first_name} will receive an email shortly.</>);
            },
            onError: (error) => formErrorHandler(form, error)
        });
    };

    const calcTypeOptions: ItemProps[] = [
        {
            icon: <IconUserShield/>,
            label: `Admin`,
            value: 'ADMIN',
            description: `Admin users have full access to events and account settings.`,
        },
        {
            icon: <IconUser/>,
            label: `Organizer`,
            value: 'ORGANIZER',
            description: `Organizers can only manage events and products. They cannot manage users, account settings or billing information.`,
        },
    ];

    return (
        <Modal heading={`Edit User`} onClose={onClose} opened>
            {user.status === 'INVITED' && (
                <Alert mb={20}>
                    <>This user is not active, as they have not accepted their invitation.</>
                </Alert>
            )}
            <form onSubmit={form.onSubmit(values => handleCreate(values))}>
                <fieldset disabled={ediMutation.isPending}>
                    <InputGroup>
                        <TextInput required {...form.getInputProps('first_name')} label={`First Name`}/>
                        <TextInput required {...form.getInputProps('last_name')} label={`Last Name`}/>
                    </InputGroup>

                    <TextInput
                        disabled
                        readOnly
                        value={user.email}
                        type={'email'}
                        label={`Email`}
                        description={<>Users can change their email in <NavLink target={'_blank'}
                                                                                     to={'/manage/profile'}>Profile
                            Settings</NavLink></>}
                    />

                    {user.is_account_owner && (
                        <Alert mb={20}>
                            {`You cannot edit the role or status of the account owner.`}
                        </Alert>
                    )}

                    <CustomSelect
                        label={`Role`}
                        optionList={calcTypeOptions}
                        form={form}
                        name={'role'}
                        disabled={user.is_account_owner}
                    />

                    {user.status !== 'INVITED' && (
                        <Select
                            disabled={user.is_account_owner}
                            label={`Status`}
                            placeholder={`Select status`}
                            required
                            {...form.getInputProps('status')}
                            description={`Inactive users cannot log in.`}

                            data={[
                                {value: 'ACTIVE', label: `Active`},
                                {value: 'INACTIVE', label: `Inactive`},
                            ]}
                        />
                    )}
                </fieldset>
                <Button
                    fullWidth
                    loading={ediMutation.isPending}
                    type={'submit'}>
                    {`Edit User`}
                </Button>
            </form>
        </Modal>
    )
}
