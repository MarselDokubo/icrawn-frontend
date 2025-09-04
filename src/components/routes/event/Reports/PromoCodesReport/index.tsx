import {useParams} from "react-router";
import {useGetEvent} from "../../../../../queries/useGetEvent.ts";
import {formatCurrency} from "../../../../../utilites/currency.ts";
import ReportTable from "../../../../common/ReportTable";
 
import {formatDate} from "../../../../../utilites/dates.ts";

const PromoCodesReport = () => {
    const {eventId} = useParams();
    const eventQuery = useGetEvent(eventId);
    const event = eventQuery.data;

    if (!event) {
        return null;
    }

    const columns = [
        {
            key: 'promo_code' as const,
            label: `Promo Code`,
            sortable: true
        },
        {
            key: 'times_used' as const,
            label: `Times Used`,
            sortable: true
        },
        {
            key: 'unique_customers' as const,
            label: `Unique Customers`,
            sortable: true
        },
        {
            key: 'configured_discount' as const,
            label: `Configured Discoun`,
            sortable: true,
            render: (value: number, row: any) => {
                if (row.discount_type === 'percentage') {
                    return `${value}%`;
                }
                return formatCurrency(value, event?.currency);
            }
        },
        {
            key: 'total_gross_sales' as const,
            label: `Total Gross Sales`,
            sortable: true,
            render: (value: string) => formatCurrency(value, event?.currency)
        },
        {
            key: 'total_before_discounts' as const,
            label: `Total Before Discounts`,
            sortable: true,
            render: (value: string) => formatCurrency(value, event?.currency)
        },
        {
            key: 'total_discount_amount' as const,
            label: `Total Discount Amoun`,
            sortable: true,
            render: (value: string) => formatCurrency(value, event?.currency)
        },
        {
            key: 'first_used_at' as const,
            label: `First Used`,
            sortable: true,
            render: (value: string) => value ? formatDate(value, 'MMM D, YYYY', event.timezone) : '-'
        },
        {
            key: 'last_used_at' as const,
            label: `Last Used`,
            sortable: true,
            render: (value: string) => value ? formatDate(value, 'MMM D, YYYY', event.timezone) : '-'
        },
        {
            key: 'max_allowed_usages' as const,
            label: `Usage Limi`,
            sortable: true,
            render: (value: number) => value || `Unlimited`
        },
        {
            key: 'remaining_uses' as const,
            label: `Remaining Uses`,
            sortable: true,
            render: (value: number) => value || `Unlimited`
        },
        {
            key: 'status' as const,
            label: `Status`,
            sortable: true
        }
    ];

    return (
        <ReportTable
            title={`Promo Codes Repor`}
            columns={columns}
            isLoading={eventQuery.isLoading}
            downloadFileName="promo_codes_report.csv"
            event={event}
        />
    );
};

export default PromoCodesReport;
