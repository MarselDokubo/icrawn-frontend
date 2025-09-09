import React, {useState} from "react";
import {useParams} from "react-router";
import {Button} from "@mantine/core";
import {IconDownload} from "@tabler/icons-react";
 
import {useGetEvent} from "../../../queries/useGetEvent";
import {useGetEventOrders} from "../../../queries/useGetEventOrders";
import {PageTitle} from "../../common/PageTitle";
import {PageBody} from "../../common/PageBody";
import {OrdersTable} from "../../common/OrdersTable";
import {SearchBarWrapper} from "../../common/SearchBar";
import {Pagination} from "../../common/Pagination";
import {ToolBar} from "../../common/ToolBar";
import {useFilterQueryParamSync} from "../../../hooks/useFilterQueryParamSync";
import {IdParam, QueryFilterOperator, QueryFilters} from "../../../types";
import {TableSkeleton} from "../../common/TableSkeleton";
import {orderClient} from "../../../api/order.client";
import {downloadBinary} from "../../../utilites/download";
import {FilterModal, FilterOption} from "../../common/FilterModal";
import {withLoadingNotification} from "../../../utilites/withLoadingNotification.tsx";

const orderStatuses = [
    {label: `Completed`, value: 'COMPLETED'},
    {label: `Cancelled`, value: 'CANCELLED'},
    {label: `Awaiting Offline payment`, value: 'AWAITING_OFFLINE_PAYMENT'},
];

const refundStatuses = [
    {label: `Refunded`, value: 'REFUNDED'},
    {label: `Partially Refunded`, value: 'PARTIALLY_REFUNDED'},
];

export const Orders: React.FC = () => {
    const {eventId} = useParams<{ eventId: string }>();
    const {data: event} = useGetEvent(eventId);
    const [searchParams, setSearchParams] = useFilterQueryParamSync();
    const ordersQuery = useGetEventOrders(eventId, searchParams as QueryFilters);
    const orders = ordersQuery?.data?.data;
    const pagination = ordersQuery?.data?.meta;
    const [downloadPending, setDownloadPending] = useState(false);

    const filterOptions: FilterOption[] = [
        {
            field: 'status',
            label: `Order Status`,
            type: 'multi-select',
            options: orderStatuses
        },
        {
            field: 'refund_status',
            label: `Refund Status`,
            type: 'multi-select',
            options: refundStatuses
        }
    ];

    const handleFilterChange = (values: Record<string, string[]>) => {
        const newFilters = {
            ...searchParams,
            filterFields: {
                ...(searchParams.filterFields || {}),
                status: values.status?.length > 0
                    ? {operator: QueryFilterOperator.In, value: values.status}
                    : undefined,
                refund_status: values.refund_status?.length > 0
                    ? {operator: QueryFilterOperator.In, value: values.refund_status}
                    : undefined
            }
        };

        setSearchParams(newFilters as QueryFilters, true); // Added true to replace instead of merge
    };

    const handleResetFilters = () => {
        const clearedFilters = {
            ...searchParams,
            filterFields: {}
        };
        setSearchParams(clearedFilters as QueryFilters, true); // Added true to replace instead of merge
    };

    const handleExport = async (eventId: IdParam) => {
        await withLoadingNotification(async () => {
                setDownloadPending(true);
                const blob = await orderClient.exportOrders(eventId);
                downloadBinary(blob, 'orders.xlsx');
            },
            {
                loading: {
                    title: `Exporting Orders`,
                    message: `Please wait while we prepare your orders for export...`
                },
                success: {
                    title: `Orders Exported`,
                    message: `Your orders have been exported successfully.`,
                    onRun: () => setDownloadPending(false)
                },
                error: {
                    title: `Failed to export orders`,
                    message: `Please try again.`,
                    onRun: () => setDownloadPending(false)
                }
            });
    };

    const currentFilters = {
        status: searchParams.filterFields?.status?.value || [],
        refund_status: searchParams.filterFields?.refund_status?.value || []
    };

    return (
        <PageBody>
            <PageTitle>{`Orders`}</PageTitle>
            <ToolBar
                filterComponent={
                    <FilterModal
                        filters={filterOptions}
                        activeFilters={currentFilters}
                        onChange={handleFilterChange}
                        onReset={handleResetFilters}
                        title={`Filter Orders`}
                    />
                }
                searchComponent={() => (
                    <SearchBarWrapper
                        placeholder={`Search by name, email, or order #...`}
                        setSearchParams={setSearchParams}
                        searchParams={searchParams}
                        pagination={pagination}
                    />
                )}
            >
                <Button
                    onClick={() => handleExport(eventId)}
                    rightSection={<IconDownload size={14}/>}
                    color="green"
                    loading={downloadPending}
                    size="sm"
                >
                    {`Expor`}
                </Button>
            </ToolBar>

            <TableSkeleton isVisible={!orders || ordersQuery.isFetching}/>

            {orders && event && (
                <OrdersTable event={event} orders={orders}/>
            )}

            {!!orders?.length && (
                <Pagination
                    value={searchParams.pageNumber}
                    onChange={(value) => setSearchParams({pageNumber: value})}
                    total={Number(pagination?.last_page)}
                />
            )}
        </PageBody>
    );
};

export default Orders;
