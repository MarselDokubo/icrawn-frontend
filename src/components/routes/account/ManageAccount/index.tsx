import {Card} from "../../../common/Card";
import {Tabs} from "@mantine/core";
import classes from "./ManageAccount.module.scss";
import {IconAdjustmentsCog, IconCreditCard, IconReceiptTax, IconUsers} from "@tabler/icons-react";
import {Outlet, useLocation, useNavigate} from "react-router";
 
import {useIsCurrentUserAdmin} from "../../../../hooks/useIsCurrentUserAdmin.ts";
import { useGetAccount } from "../../../../queries/useGetAccount.ts";

export const ManageAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const tabValue = location.pathname.split('/').pop() || 'settings';
    const isUserAdmin = useIsCurrentUserAdmin();
    const {data: account} = useGetAccount();

    return (
        <div className={classes.container}>
            <h1>{`Account Settings`}</h1>
            <Card className={classes.tabsCard}>
                <Tabs value={tabValue} onChange={(value) => navigate(`/account/${value}`)}>
                    <Tabs.List grow>
                        <Tabs.Tab value="settings" leftSection={<IconAdjustmentsCog/>}>
                            {`Accoun`}
                        </Tabs.Tab>
                        <Tabs.Tab value="taxes-and-fees" leftSection={<IconReceiptTax/>}>
                            {`Tax & Fees`}
                        </Tabs.Tab>

                        {isUserAdmin && (
                            <Tabs.Tab value="users" leftSection={<IconUsers/>}>
                                {`Users`}
                            </Tabs.Tab>
                        )}

                        {(isUserAdmin && account && account.is_saas_mode_enabled) && (
                            <Tabs.Tab value="payment" leftSection={<IconCreditCard/>}>
                                {`Payment & Plan`}
                            </Tabs.Tab>
                        )}
                    </Tabs.List>
                </Tabs>
            </Card>
            <div className={classes.tabWrapper}>
                <Outlet/>
            </div>
        </div>
    );
};

export default ManageAccount;
