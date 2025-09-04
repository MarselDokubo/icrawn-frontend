import {Event, Product, ProductPrice} from "../../../types.ts";
 
import {Tooltip} from "@mantine/core";
import {prettyDate, relativeDate} from "../../../utilites/dates.ts";
import {IconInfoCircle} from "@tabler/icons-react";

const ProductPriceSaleDateMessage = ({price, event}: { price: ProductPrice, event: Event }) => {
    if (price.is_sold_out) {
        return `Sold ou`;
    }

    if (price.is_after_sale_end_date) {
        return `Sales ended`;
    }

    if (price.is_before_sale_start_date) {
        return (
            <span>
                {`Sales star`}{' '}
                <Tooltip label={prettyDate(String(price.sale_start_date), event.timezone)}>
                    <span>{relativeDate(String(price.sale_start_date))}{' '}<IconInfoCircle size={12}/></span>
                </Tooltip>
            </span>
        );
    }

    return `Not available`;
}

export const ProductAvailabilityMessage = ({product, event}: { product: Product, event: Event }) => {
    if (product.is_sold_out) {
        return `Sold ou`;
    }
    if (product.is_after_sale_end_date) {
        return `Sales ended`;
    }
    if (product.is_before_sale_start_date) {
        return (
            <span>
                {`Sales star`}{' '}
                <Tooltip label={prettyDate(String(product.sale_start_date), event.timezone)}>
                    <span>{relativeDate(String(product.sale_start_date))}{' '}<IconInfoCircle size={12}/></span>
                </Tooltip>
            </span>
        );
    }

    return `Not available`;
}

interface ProductAndPriceAvailabilityProps {
    product: Product;
    price: ProductPrice;
    event: Event;
}

export const ProductPriceAvailability = ({product, price, event}: ProductAndPriceAvailabilityProps) => {

    if (product.type === 'TIERED') {
        return <ProductPriceSaleDateMessage price={price} event={event}/>
    }

    return <ProductAvailabilityMessage product={product} event={event}/>
}
