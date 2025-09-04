import {InputGroup} from "../../common/InputGroup";
import {NumberInput, TextInput} from "@mantine/core";
 
import {UseFormReturnType} from "@mantine/form";
import {CapacityAssignmentRequest, ProductCategory} from "../../../types.ts";
import {CustomSelect, ItemProps} from "../../common/CustomSelect";
import {IconCheck, IconX} from "@tabler/icons-react";
import {ProductSelector} from "../../common/ProductSelector";

interface CapacityAssigmentFormProps {
    form: UseFormReturnType<CapacityAssignmentRequest>;
    productsCategories: ProductCategory[],
}

export const CapacityAssigmentForm = ({form, productsCategories}: CapacityAssigmentFormProps) => {
    const statusOptions: ItemProps[] = [
        {
            icon: <IconCheck/>,
            label: `Active`,
            value: 'ACTIVE',
            description: `Enable this capacity to stop product sales when the limit is reached`,
        },
        {
            icon: <IconX/>,
            label: `Inactive`,
            value: 'INACTIVE',
            description: `Disabling this capacity will track sales but not stop them when the limit is reached`,
        },
    ];

    return (
        <>
            <InputGroup>
                <TextInput
                    {...form.getInputProps('name')}
                    required
                    label={`Name`}
                    placeholder={`Day one capacity`}
                />
                <NumberInput
                    {...form.getInputProps('capacity')}
                    label={`Capacity`}
                    placeholder={`Unlimited`}
                />
            </InputGroup>

            <ProductSelector
                label={`What products should this capacity apply to?`}
                placeholder={`Select products`}
                productCategories={productsCategories}
                form={form}
                productFieldName={'product_ids'}
            />

            <CustomSelect
                label={`Status`}
                required
                form={form}
                name={'status'}
                optionList={statusOptions}
            />
        </>
    );
}
