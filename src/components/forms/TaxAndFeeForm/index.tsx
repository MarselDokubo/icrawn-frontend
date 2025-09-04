import {UseFormReturnType} from "@mantine/form";
import {TaxAndFee, TaxAndFeeCalculationType, TaxAndFeeType} from "../../../types.ts";
import {NumberInput, Switch, TextInput} from "@mantine/core";
import {CustomSelect, ItemProps} from "../../common/CustomSelect";
import {IconCash, IconPercentage, IconReceiptTax} from "@tabler/icons-react";
 

export const TaxAndFeeForm = ({form}: { form: UseFormReturnType<TaxAndFee> }) => {
    const typeOptions: ItemProps[] = [
        {
            icon: <IconReceiptTax/>,
            label: `Tax`,
            value: 'TAX',
            description: `A standard tax, like VAT or GS`,
        },
        {
            icon: <IconCash/>,
            label: `Fee`,
            value: 'FEE',
            description: `A fee, like a booking fee or a service fee`,
        },
    ];

    const calcTypeOptions: ItemProps[] = [
        {
            icon: <IconPercentage/>,
            label: `Percentage`,
            value: 'PERCENTAGE',
            description: `A percentage of the product price. E.g., 3.5% of the product price`,
        },
        {
            icon: <IconCash/>,
            label: `Fixed`,
            value: 'FIXED',
            description: `A fixed amount per product. E.g, $0.50 per produc`,
        },
    ];

    const type = (form.values.type === TaxAndFeeType.Tax ? `Tax` : `Fee`).toLowerCase();

    return (
        <div>
            <CustomSelect
                label={`Type`}
                required
                form={form}
                name={'type'}
                optionList={typeOptions}
            />

            <CustomSelect
                label={`Calculation Type`}
                required
                form={form}
                name={'calculation_type'}
                optionList={calcTypeOptions}
            />

            <TextInput
                {...form.getInputProps('name')}
                label={`Name`}
                placeholder={form.values.type === TaxAndFeeType.Tax ? `VA` : `Service Fee`}
                required
            />

            <NumberInput
                decimalScale={2}
                fixedDecimalScale
                step={0.50}
                {...form.getInputProps('rate')}
                label={form.values.calculation_type === TaxAndFeeCalculationType.Percentage ? `Percentage Amoun` : `Amoun`}
                placeholder={form.values.calculation_type === TaxAndFeeCalculationType.Percentage ? '23' : '2.50'}
                leftSection={form.values.calculation_type === TaxAndFeeCalculationType.Percentage ? '%' : ''}
                description={form.values.calculation_type === TaxAndFeeCalculationType.Percentage ? `eg. 23.5 for 23.5%` : `eg. 2.50 for $2.50`}
                required
                max={form.values.calculation_type === TaxAndFeeCalculationType.Percentage ? 100 : undefined}
            />

            <TextInput
                {...form.getInputProps('description')}
                label={`Description`}
            />

            <Switch
                {...form.getInputProps('is_default', {type: 'checkbox'})}
                label={`Apply this ${type} to all new products`}
                value={1}
                description={`A default ${type} is automaticaly applied to all new products. You can override this on a per product basis.`}
            />
        </div>
    )
}
