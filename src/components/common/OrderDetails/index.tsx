import {Anchor, Tooltip} from "@mantine/core";
import {prettyDate, relativeDate} from "../../../utilites/dates.ts";
import {OrderStatusBadge} from "../OrderStatusBadge";
import {Currency} from "../Currency";
import {Card, CardVariant} from "../Card";
import {Event, Order} from "../../../types.ts";
import classes from "./OrderDetails.module.scss";
import {t} from "@lingui/macro";
import {formatAddress} from "../../../utilites/addressUtilities.ts";
import React from "react";
import {capitalize} from "../../../utilites/stringHelper.ts";

export const OrderDetails = ({order, event, cardVariant = 'lightGray', style = {}}: {
    order: Order,
    event: Event,
    cardVariant?: CardVariant,
    style?: React.CSSProperties
}) => {
    return (
        <Card className={classes.orderDetails} variant={cardVariant} style={style}>
            <div className={classes.block}>
                <div className={classes.title}>
                    {`Name`}
                </div>
                <div className={classes.amount}>
                    {order.first_name} {order.last_name}
                </div>
            </div>
            <div className={classes.block}>
                <div className={classes.title}>
                    {`Email`}
                </div>
                <div className={classes.value}>
                    <Anchor href={'mailto:' + order.email} target={'_blank'}>{order.email}</Anchor>
                </div>
            </div>
            <div className={classes.block}>
                <div className={classes.title}>
                    {`Date`}
                </div>
                <div className={classes.amount}>
                    <Tooltip label={prettyDate(order.created_at, event.timezone)} position={'bottom'} withArrow>
                            <span>
                                {relativeDate(order.created_at)}
                            </span>
                    </Tooltip>
                </div>
            </div>
            <div className={classes.block}>
                <div className={classes.title}>
                    {`Status`}
                </div>
                <div className={classes.amount}>
                    <OrderStatusBadge order={order} variant={'outline'}/>
                </div>
            </div>
            <div className={classes.block}>
                <div className={classes.title}>
                    {`Total order amoun`}
                </div>
                <div className={classes.amount}>
                    <Currency currency={order.currency} price={order.total_gross}/>
                </div>
            </div>
            <div className={classes.block}>
                <div className={classes.title}>
                    {`Total refunded`}
                </div>
                <div className={classes.amount}>
                    <Currency currency={order.currency} price={order.total_refunded}/>
                </div>
            </div>
            {order.payment_provider && (
                <div className={classes.block}>
                    <div className={classes.title}>
                        {`Payment provider`}
                    </div>
                    <div className={classes.amount}>
                        {capitalize(order.payment_provider)}
                    </div>
                </div>
            )}
            {order.promo_code && (
                <div className={classes.block}>
                    <div className={classes.title}>
                        {`Promo code`}
                    </div>
                    <div className={classes.amount}>
                        {order.promo_code}
                    </div>
                </div>
            )}
            {order.address && (
                <div className={classes.block}>
                    <div className={classes.title}>
                        {`Address`}
                    </div>
                    <div className={classes.amount}>
                        {formatAddress(order.address)}
                    </div>
                </div>
            )}
        </Card>
    );
}
