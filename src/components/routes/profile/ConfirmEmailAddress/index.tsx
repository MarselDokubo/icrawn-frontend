import {useNavigate, useParams} from "react-router";
import {useGetMe} from "../../../../queries/useGetMe";
import {Card} from "../../../common/Card";
import {showError, showSuccess} from "../../../../utilites/notifications";
import {t} from "@lingui/macro";
import {useConfirmEmailAddress} from "../../../../mutations/useConfirmEmailAddress";
import {useEffect} from "react";

const ConfirmEmailAddress = () => {
    const {token} = useParams();
    const {data: userData, isFetched} = useGetMe();
    const navigate = useNavigate();
    const confirmEmailAddressMutation = useConfirmEmailAddress();

    const confirmEmail = () => {

        if (!userData?.id) {
            return;
        }

        confirmEmailAddressMutation.mutate({token: (token as string), userId: userData?.id}, {
            onSuccess: () => {
                showSuccess(`Successfully confirmed email address`);
                navigate('/manage/events');
            },
            onError: () => {
                showError(`Error confirming email address`);
            }
        });
    };

    useEffect(() => confirmEmail(), [isFetched]);

    return (
        <Card style={{marginTop: 'var(--hi-spacing-lg)'}}>
            <p>{`Confirming email address...`}</p>
        </Card>
    );
};

export default ConfirmEmailAddress;
