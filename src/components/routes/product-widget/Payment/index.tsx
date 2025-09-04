import React, {useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useGetEventPublic} from "../../../../queries/useGetEventPublic.ts";
import {CheckoutContent} from "../../../layouts/Checkout/CheckoutContent";
import {StripePaymentMethod} from "./PaymentMethods/Stripe";
import {PaystackPaymentMethod} from "./PaymentMethods/Paystack";
import {OfflinePaymentMethod} from "./PaymentMethods/Offline";
import {Event, Order} from "../../../../types.ts";
import {CheckoutFooter} from "../../../layouts/Checkout/CheckoutFooter";
import {Group} from "@mantine/core";
import {formatCurrency} from "../../../../utilites/currency.ts";
import {t} from "@lingui/macro";
import {useGetOrderPublic} from "../../../../queries/useGetOrderPublic.ts";
import {
    useTransitionOrderToOfflinePaymentPublic
} from "../../../../mutations/useTransitionOrderToOfflinePaymentPublic.ts";
import {Card} from "../../../common/Card";
import {showError} from "../../../../utilites/notifications.tsx";

const Payment = () => {
    const navigate = useNavigate();
    const {eventId, orderShortId} = useParams();
    const {data: event, isFetched: isEventFetched} = useGetEventPublic(eventId);
    const {data: order, isFetched: isOrderFetched} = useGetOrderPublic(eventId, orderShortId, ['event']);
    const isLoading = !isOrderFetched;
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [activePaymentMethod, setActivePaymentMethod] = useState<'STRIPE' | 'PAYSTACK' | 'OFFLINE' | null>(null);
    const [submitHandler, setSubmitHandler] = useState<(() => Promise<void>) | null>(null);
    const transitionOrderToOfflinePaymentMutation = useTransitionOrderToOfflinePaymentPublic();

    const isPaystackEnabled = event?.settings?.payment_providers?.includes('PAYSTACK');
    const isStripeEnabled = event?.settings?.payment_providers?.includes('STRIPE');
    const isOfflineEnabled = event?.settings?.payment_providers?.includes('OFFLINE');

    React.useEffect(() => {
        // Automatically set the first available payment method
        if (isPaystackEnabled) {
            setActivePaymentMethod('PAYSTACK');
        } else if (isStripeEnabled) {
            setActivePaymentMethod('STRIPE');
        } else if (isOfflineEnabled) {
            setActivePaymentMethod('OFFLINE');
        } else {
            setActivePaymentMethod(null); // No methods available
        }
    }, [isPaystackEnabled, isStripeEnabled, isOfflineEnabled]);

    const handleParentSubmit = () => {
        if (submitHandler) {
            setIsPaymentLoading(true);
            submitHandler().finally(() => setIsPaymentLoading(false));
        }
    };

    const handleSubmit = async () => {
        if (activePaymentMethod === 'PAYSTACK' || activePaymentMethod === 'STRIPE') {
            handleParentSubmit();
        } else if (activePaymentMethod === 'OFFLINE') {
            setIsPaymentLoading(true);

            await transitionOrderToOfflinePaymentMutation.mutateAsync({
                eventId,
                orderShortId
            }, {
                onSuccess: () => {
                    navigate(`/checkout/${eventId}/${orderShortId}/summary`);
                },
                onError: (error: any) => {
                    setIsPaymentLoading(false);
                    showError(error.response?.data?.message || t`Offline payment failed. Please try again or contact the event organizer.`);
                }
            });
        }
    };

    if (!isStripeEnabled && !isOfflineEnabled && isOrderFetched && isEventFetched) {
        return (
            <CheckoutContent>
                <Card>
                    {t`No payment methods are currently available. Please contact the event organizer for assistance.`}
                </Card>
            </CheckoutContent>
        );
    }

    return (
        <>
            <CheckoutContent>
                {isPaystackEnabled && (
                    <div style={{display: activePaymentMethod === 'PAYSTACK' ? 'block' : 'none'}}>
                        <PaystackPaymentMethod enabled={true} setSubmitHandler={setSubmitHandler}/>
                    </div>
                )}
                {isStripeEnabled && (
                    <div style={{display: activePaymentMethod === 'STRIPE' ? 'block' : 'none'}}>
                        <StripePaymentMethod enabled={true} setSubmitHandler={setSubmitHandler}/>
                    </div>
                )}
                {isOfflineEnabled && (
                    <div style={{display: activePaymentMethod === 'OFFLINE' ? 'block' : 'none'}}>
                        <OfflinePaymentMethod event={event as Event}/>
                    </div>
                )}
                {(isPaystackEnabled && (isStripeEnabled || isOfflineEnabled)) && (
                    <div style={{marginTop: '20px'}}>
                        <a
                            onClick={() => setActivePaymentMethod(
                                activePaymentMethod === 'PAYSTACK'
                                    ? (isStripeEnabled ? 'STRIPE' : 'OFFLINE')
                                    : 'PAYSTACK'
                            )}
                            style={{cursor: 'pointer'}}
                        >
                            {activePaymentMethod === 'PAYSTACK'
                                ? t`I would like to pay using another method`
                                : t`I would like to pay using Paystack (Nigerian cards, etc.)`
                            }
                        </a>
                    </div>
                )}
                {(isStripeEnabled && isOfflineEnabled && !isPaystackEnabled) && (
                    <div style={{marginTop: '20px'}}>
                        <a
                            onClick={() => setActivePaymentMethod(
                                activePaymentMethod === 'STRIPE' ? 'OFFLINE' : 'STRIPE'
                            )}
                            style={{cursor: 'pointer'}}
                        >
                            {activePaymentMethod === 'STRIPE'
                                ? t`I would like to pay using an offline method`
                                : t`I would like to pay using an online method (credit card etc.)`
                            }
                        </a>
                    </div>
                )}
            </CheckoutContent>

            <CheckoutFooter
                event={event as Event}
                order={order as Order}
                isLoading={isLoading || isPaymentLoading}
                onClick={handleSubmit}
                buttonContent={order?.is_payment_required ? (
                    <Group gap={'10px'}>
                        <div style={{fontWeight: "bold"}}>
                            {t`Place Order`}
                        </div>
                        <div style={{fontSize: 14}}>
                            {formatCurrency(order.total_gross, order.currency)}
                        </div>
                        <div style={{fontSize: 14, fontWeight: 500}}>
                            {order.currency}
                        </div>
                    </Group>
                ) : t`Complete Payment`}
            />
        </>
    );
}

export default Payment;
