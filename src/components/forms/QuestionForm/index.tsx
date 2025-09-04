import {CustomSelect, ItemProps} from "../../common/CustomSelect";
import {t, Trans} from "@lingui/macro";
import {ProductCategory, QuestionBelongsToType, QuestionType} from "../../../types.ts";
import {Button, Group, Switch, TextInput} from "@mantine/core";
import {
    IconAlignBoxLeftTop,
    IconCalendar,
    IconCircleCheck,
    IconForms,
    IconMapPin,
    IconReceipt,
    IconSelector,
    IconSquareCheck,
    IconTicket,
    IconTrash,
    IconUser
} from "@tabler/icons-react";
import {UseFormReturnType} from "@mantine/form";
import {Card} from "../../common/Card";
import classes from "./QuestionForm.module.scss";
import {Editor} from "../../common/Editor";
import {useState} from "react";
import {ProductSelector} from "../../common/ProductSelector";

const Options = ({form}: { form: UseFormReturnType<any> }) => {
    return (
        <Card>
            <h3 className={classes.optionsHeading}><Trans>Options</Trans></h3>
            {form.values.options.length === 0 && (
                <div className={classes.noOptionsMessage}>
                    <Trans>Please add at least one option</Trans>
                </div>
            )}

            {form.values.options.map((_: any, index: number) => {
                const i = index + 1;
                return (
                    <Group wrap={'nowrap'} justify={'space-between'} className={classes.optionRow}>
                        <div className={classes.optionInputWrap}>
                            <TextInput
                                key={index}
                                mt={0}
                                mb={0}
                                {...form.getInputProps(`options.${index}`)}
                                placeholder={`Option ${i}`}
                                required
                                className={classes.optionInput}
                            />
                        </div>
                        <div className={classes.optionButton}>
                            <Button
                                size='xs'
                                variant="outline"
                                onClick={() => form.setFieldValue('options', form.values.options.filter((_: any, i: number) => i !== index))}
                            >
                                <IconTrash size={16}/>
                            </Button>
                        </div>
                    </Group>
                );
            })}

            <Button
                variant="outline"
                onClick={() => form.setFieldValue('options', [...form.values.options, ''])}
                size="xs"
            >
                {`Add Option`}
            </Button>
        </Card>
    )
};

interface QuestionFormProps {
    form: UseFormReturnType<any>;
    productCategories?: ProductCategory[];
}

export const QuestionForm = ({form, productCategories}: QuestionFormProps) => {
    const [showDescription, setShowDescription] = useState(false);

    const belongToOptions: ItemProps[] = [
        {
            icon: <IconReceipt/>,
            label: `Ask once per order`,
            value: QuestionBelongsToType.ORDER,
            description: `A single question per order. E.g, What is your shipping address?`,
        },
        {
            icon: <IconUser/>,
            label: `Ask once per produc`,
            value: QuestionBelongsToType.PRODUCT,
            description: `A single question per product. E.g, What is your t-shirt size?`,
        },
    ];

    const questionTypeOptions: ItemProps[] = [
        {
            icon: <IconForms/>,
            label: `Single line text box`,
            value: QuestionType.SINGLE_LINE_TEXT,
            description: `A single line text inpu`,
        },
        {
            icon: <IconAlignBoxLeftTop/>,
            label: `Multi line text box`,
            value: QuestionType.MULTI_LINE_TEXT,
            description: `A multi line text inpu`,
        },
        {
            icon: <IconSquareCheck/>,
            label: `Checkboxes`,
            value: QuestionType.CHECKBOX,
            description: `Checkbox options allow multiple selections`,
        },
        {
            icon: <IconCircleCheck/>,
            label: `Radio Option`,
            value: QuestionType.RADIO,
            description: `A Radio option has multiple options but only one can be selected.`,
        },
        {
            icon: <IconSelector/>,
            label: `Dropdown selection`,
            value: QuestionType.DROPDOWN,
            description: `A Dropdown input allows only one selection`,
        },
        {
            icon: <IconMapPin/>,
            label: `Address`,
            value: QuestionType.ADDRESS,
            description: `Shows common address fields, including country`,
        },
        {
            icon: <IconCalendar/>,
            label: `Date`,
            value: QuestionType.DATE,
            description: `A date input. Perfect for asking for a date of birth etc.`,
        }
    ];
    const multiAnswerQuestionTypes = [
        QuestionType.CHECKBOX.toString(),
        QuestionType.RADIO.toString(),
        QuestionType.DROPDOWN.toString(),
    ];

    return (
        <>
            <CustomSelect
                optionList={belongToOptions}
                label={`Who should be asked this question?`}
                required
                form={form}
                name="belongs_to"
            />

            {form.values.belongs_to === QuestionBelongsToType.PRODUCT && (
                <ProductSelector
                    label={`What products does this code apply to?`}
                    placeholder="Select products"
                    icon={<IconTicket size="1rem"/>}
                    productCategories={productCategories ?? []}
                    form={form}
                    productFieldName="product_ids"
                />
            )}

            <CustomSelect
                optionList={questionTypeOptions}
                label={`What type of question is this?`}
                required
                form={form}
                name="type"
            />

            <TextInput
                {...form.getInputProps('title')}
                label={`Question Title`}
                placeholder={`What time will you be arriving?`}
                required
            />

            {(showDescription || form.values.description) ? (
                <Editor
                    maxLength={10000}
                    editorType={'simple'}
                    error={form.errors.description as string}
                    label={`Question Description`}
                    description={`Provide additional context or instructions for this question. Use this field to add terms
                                and conditions, guidelines, or any important information that attendees need to know before answering.`}
                    value={form.values.description}
                    onChange={(value: string) => form.setFieldValue('description', value)}
                />
            ) : (
                <Button
                    variant="transparent"
                    ml={0}
                    pl={0}
                    mb={10}
                    onClick={() => setShowDescription(true)}
                >
                    {`Add description`}
                </Button>
            )}

            {multiAnswerQuestionTypes.includes(form.values.type) && <Options form={form}/>}

            <Switch
                mt={20}
                {...form.getInputProps('required', {type: 'checkbox'})}
                description={`Mandatory questions must be answered before the customer can checkout.`}
                label={`Make this question mandatory`}
            />

            <Switch
                mt={20}
                {...form.getInputProps('is_hidden', {type: 'checkbox'})}
                description={`Hidden questions are only visible to the event organizer and not to the customer.`}
                label={`Hide this question`}
            />
        </>
    )
}
