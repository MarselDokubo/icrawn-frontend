import {Textarea, TextInput} from "@mantine/core";
 
import {UseFormReturnType} from "@mantine/form";
import {CheckInListRequest, ProductCategory, ProductType} from "../../../types.ts";
import {InputLabelWithHelp} from "../../common/InputLabelWithHelp";
import {InputGroup} from "../../common/InputGroup";
import {ProductSelector} from "../../common/ProductSelector";

interface CheckInListFormProps {
    form: UseFormReturnType<CheckInListRequest>;
    productCategories: ProductCategory[],
}

export const CheckInListForm = ({form, productCategories}: CheckInListFormProps) => {
    return (
        <>
            <TextInput
                {...form.getInputProps('name')}
                required
                label={`Name`}
                placeholder={`VIP check-in lis`}
            />

            <ProductSelector
                label={`Which tickets should be associated with this check-in list?`}
                placeholder={`Select tickets`}
                productCategories={productCategories}
                form={form}
                productFieldName="product_ids"
                includedProductTypes={[ProductType.Ticket]}
            />

            <Textarea
                {...form.getInputProps('description')}
                label={<InputLabelWithHelp
                    label={`Description for check-in staff`}
                    helpText={`This description will be shown to the check-in staff`}
                />}
                placeholder={`Add a description for this check-in lis`}
            />

            <InputGroup>
                <TextInput
                    {...form.getInputProps('activates_at')}
                    type="datetime-local"
                    label={<InputLabelWithHelp
                        label={`Activation date`}
                        helpText={`No attendees will be able to check in before this date using this lis`}
                    />}
                    placeholder={`What date should this check-in list become active?`}
                />
                <TextInput
                    {...form.getInputProps('expires_at')}
                    type="datetime-local"
                    label={<InputLabelWithHelp
                        label={`Expiration date`}
                        helpText={`This list will no longer be available for check-ins after this date`}
                    />}
                    placeholder={`When should this check-in list expire?`}
                />
            </InputGroup>
        </>
    );
}
