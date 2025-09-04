import {Modal} from "../../common/Modal";
 
import {Account, IdParam} from "../../../types.ts";
import classes from "./ChooseAccountModal.module.scss";

interface ChooseAccountModalProps {
    onAccountChosen: (accountId: IdParam) => void;
    accounts: Account[];
}

export const ChooseAccountModal = ({onAccountChosen, accounts}: ChooseAccountModalProps) => {
    return (
        <Modal heading={`Choose an accoun`} withCloseButton={false} onClose={()=>{}} opened>
            <p>{`You have access to multiple accounts. Please choose one to continue.`}</p>
                {accounts.map(account => (
                    <div key={account.id} className={classes.accountRow} onClick={() => onAccountChosen(account.id)}>
                        {account.name}
                    </div>
                ))}
        </Modal>
    )
}
