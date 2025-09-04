import {UseFormReturnType} from "@mantine/form";
import {Alert, Button, NumberInput, Select, TextInput} from "@mantine/core";
import {IconAlertCircle, IconPercentage, IconRefresh, IconTicket} from "@tabler/icons-react";
import {ProductType, PromoCode, PromoCodeDiscountType} from "../../../types.ts";
import {useGetEvent} from "../../../queries/useGetEvent.ts";
import {useParams} from "react-router";
import {LoadingMask} from "../../common/LoadingMask";
import {t} from "@lingui/macro";
import {InputGroup} from "../../common/InputGroup";
import {getCurrencySymbol} from "../../../utilites/currency.ts";
import {ProductSelector} from "../../common/ProductSelector";
import {ShowForDesktop, ShowForMobile} from "../../common/Responsive/ShowHideComponents.tsx";

interface PromoCodeFormProps {
    form: UseFormReturnType<PromoCode>,
}

export const PromoCodeForm = ({form}: PromoCodeFormProps) => {
    const {eventId} = useParams();
    const {data: event, data: {product_categories: productCategories} = {}} = useGetEvent(eventId);

    const DiscountIcon = () => {
        if (form.values.discount_type === 'PERCENTAGE') {
            return <IconPercentage/>;
        }
        return getCurrencySymbol(event?.currency as string);
    };

    if (!event || !productCategories) {
        return <LoadingMask/>
    }

    const generateRandomCode = () => {
        const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        form.setFieldValue('code', randomCode);
    };

    return (
        <>
            <TextInput
                {...form.getInputProps('code')}
                label={`Code`}
                placeholder="20OFF"
                required
                rightSection={(
                    <Button
                        variant="subtle"
                        size="xs"
                        color="gray"
                        onClick={generateRandomCode}
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

            <Alert variant={'light'} mt={20} mb={20} icon={<IconAlertCircle size="1rem"/>} title={`TIP`}>
                {`A promo code with no discount can be used to reveal hidden products.`}
            </Alert>

            <InputGroup>
                <Select
                    {...form.getInputProps('discount_type')}
                    label={`Discount Type`}
                    data={[
                        {
                            value: 'NONE',
                            label: `No Discoun`,
                        },
                        {
                            value: 'PERCENTAGE',
                            label: `Percentage`,
                        },
                        {
                            value: 'FIXED',
                            label: `Fixed amoun`,
                        },
                    ]}/>
                <NumberInput
                    disabled={form.values.discount_type === PromoCodeDiscountType.None}
                    decimalScale={2} min={0}
                    leftSection={<DiscountIcon/>}
                    {...form.getInputProps('discount')}
                    label={(form.values.discount_type === 'PERCENTAGE' ? `Discount %` : `Discount in ${event.currency}`)}
                    placeholder="0.00"/>
            </InputGroup>

            <ProductSelector
                label={`What products does this code apply to? (Applies to all by default)`}
                placeholder="Select products"
                icon={<IconTicket size="1rem"/>}
                productCategories={productCategories}
                form={form}
                productFieldName="applicable_product_ids"
            />

            <InputGroup>
                <TextInput type={'datetime-local'}
                           {...form.getInputProps('expiry_date')}
                           label={`Expiry Date`}
                />
                <NumberInput min={1}
                             placeholder={`Unlimited`}
                             {...form.getInputProps('max_allowed_usages')}
                             label={`How many times can this code be used?`}/>
            </InputGroup>
        </>
    );
};
