import {InputGroup} from "../../common/InputGroup";
import {Button, TextInput} from "@mantine/core";
 
import {UseFormReturnType} from "@mantine/form";
import {CreateAffiliateRequest, UpdateAffiliateRequest} from "../../../api/affiliate.client.ts";
import {CustomSelect, ItemProps} from "../../common/CustomSelect";
import {IconCheck, IconRefresh, IconX} from "@tabler/icons-react";
import {ShowForDesktop, ShowForMobile} from "../../common/Responsive/ShowHideComponents.tsx";

interface AffiliateFormProps {
    form: UseFormReturnType<CreateAffiliateRequest | UpdateAffiliateRequest>;
    isEditing?: boolean;
    existingCode?: string;
    onGenerateCode?: () => void;
}

export const AffiliateForm = ({form, isEditing = false, existingCode, onGenerateCode}: AffiliateFormProps) => {
    const statusOptions: ItemProps[] = [
        {
            icon: <IconCheck/>,
            label: `Active`,
            value: 'ACTIVE',
            description: `Affiliate sales will be tracked`,
        },
        {
            icon: <IconX/>,
            label: `Inactive`,
            value: 'INACTIVE',
            description: `Affiliate sales will not be tracked. This will deactivate the affiliate.`,
        },
    ];

    return (
        <>
            {!isEditing && (
                <>
                    <TextInput
                        label={`Code`}
                        placeholder={`Enter unique affiliate code`}
                        required
                        description={`This code will be used to track sales. Only letters, numbers, hyphens, and underscores allowed.`}
                        {...form.getInputProps('code')}
                        onChange={(event) => {
                            form.setFieldValue('code', event.target.value.toUpperCase());
                        }}
                        rightSection={(
                            <Button
                                variant="subtle"
                                size="xs"
                                color="gray"
                                onClick={onGenerateCode}
                                style={{fontWeight: 400}}
                                title={`Generate code`}
                                leftSection={<IconRefresh size={16}/>}
                            >
                                <ShowForMobile>
                                    {`Generate`}
                                </ShowForMobile>
                                <ShowForDesktop>
                                    {`Generate code`}
                                </ShowForDesktop>

                            </Button>
                        )}
                        rightSectionWidth={'auto'}
                    />
                </>
            )}

            {isEditing && existingCode && (
                <TextInput
                    label={`Code`}
                    value={existingCode}
                    disabled
                    description={`Affiliate code cannot be changed`}
                />
            )}

            <InputGroup>
                <TextInput
                    label={`Name`}
                    description={`This will not be visible to customers, but helps you identify the affiliate.`}
                    placeholder={`Enter affiliate name`}
                    required
                    {...form.getInputProps('name')}
                />

                <TextInput
                    label={`Email`}
                    description={`An email to associate with this affiliate. The affiliate will not be notified.`}
                    placeholder={`Enter affiliate email (optional)`}
                    type="email"
                    {...form.getInputProps('email')}
                />
            </InputGroup>

            <CustomSelect
                label={`Status`}
                required
                form={form}
                name={'status'}
                optionList={statusOptions}
            />
        </>
    );
};
