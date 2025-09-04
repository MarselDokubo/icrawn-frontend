import {useForm} from "@mantine/form";
import {TaxAndFeeForm} from "../../forms/TaxAndFeeForm";
import {GenericModalProps, TaxAndFee, TaxAndFeeCalculationType, TaxAndFeeType} from "../../../types.ts";
import {Modal} from "../../common/Modal";
import {Button} from "@mantine/core";
import {useFormErrorResponseHandler} from "../../../hooks/useFormErrorResponseHandler.tsx";
import {showSuccess} from "../../../utilites/notifications.tsx";
import {t, Trans} from "@lingui/macro";
import {useUpdateTaxOrFee} from "../../../mutations/useUpdateTaxOrFee.ts";
import {useEffect} from "react";

interface EditTaxOrFeeModalProps extends GenericModalProps {
    taxOrFee: TaxAndFee;
}

export const EditTaxOrFeeModal = ({onClose, taxOrFee}: EditTaxOrFeeModalProps) => {
    const updateMutation = useUpdateTaxOrFee();
    const formErrorHandler = useFormErrorResponseHandler();

    const form = useForm<TaxAndFee>({
        initialValues: {
            name: '',
            type: TaxAndFeeType.Tax,
            calculation_type: TaxAndFeeCalculationType.Percentage,
            rate: undefined,
            description: undefined,
            is_default: true,
            is_active: true,
        },
    });

    useEffect(() => {
        form.setValues(taxOrFee);
    }, [taxOrFee]);

    const handleEdit = (values: TaxAndFee) => {
        updateMutation.mutate({
            taxOrFeeId: taxOrFee.id,
            taxOrFeeData: values,
        }, {
            onSuccess: () => {
                showSuccess(<>{form.values.type === TaxAndFeeType.Tax ? `Tax` : `Fee`} updated
                    successfully</>);
                form.reset();
                onClose();
            },
            onError: (error: any) => formErrorHandler(form, error)
        });
    };

    return (
        <Modal heading={ <>Edit {form.values.type === TaxAndFeeType.Tax ? `Tax` : `Fee`}</>} onClose={onClose} opened>
            <form onSubmit={form.onSubmit(values => handleEdit(values))}>
                <TaxAndFeeForm form={form}/>
                <Button
                    fullWidth
                    loading={updateMutation.isPending}
                    type={'submit'}>
                    <>Update {form.values.type === TaxAndFeeType.Tax ? `Tax` : `Fee`}</>
                </Button>
            </form>
        </Modal>
    )
}
