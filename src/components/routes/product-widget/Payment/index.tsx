// frontend/src/components/routes/product-widget/Payment/index.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGetEventPublic } from "../../../../queries/useGetEventPublic.ts";
import { CheckoutContent } from "../../../layouts/Checkout/CheckoutContent";
import { PaystackPaymentMethod } from "./PaymentMethods/Paystack";
import { OfflinePaymentMethod } from "./PaymentMethods/Offline";
import { Event, Order } from "../../../../types.ts";
import { CheckoutFooter } from "../../../layouts/Checkout/CheckoutFooter";
import { Group } from "@mantine/core";
import { formatCurrency } from "../../../../utilites/currency.ts";
import { useGetOrderPublic } from "../../../../queries/useGetOrderPublic.ts";
import { useTransitionOrderToOfflinePaymentPublic } from "../../../../mutations/useTransitionOrderToOfflinePaymentPublic.ts";
import { Card } from "../../../common/Card";
import { showError } from "../../../../utilites/notifications.tsx";

const Payment = () => {
  const navigate = useNavigate();
  const { eventId, orderShortId } = useParams();
  const { data: event, isFetched: isEventFetched } = useGetEventPublic(eventId);
  const { data: order, isFetched: isOrderFetched } = useGetOrderPublic(eventId, orderShortId, ["event"]);
  const isLoading = !isOrderFetched;

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState<"PAYSTACK" | "OFFLINE" | null>(null);
  const [submitHandler, setSubmitHandler] = useState<(() => Promise<void>) | null>(null);

  const transitionOrderToOfflinePaymentMutation = useTransitionOrderToOfflinePaymentPublic();

  const isPaystackEnabled = event?.settings?.payment_providers?.includes("PAYSTACK");
  const isOfflineEnabled = event?.settings?.payment_providers?.includes("OFFLINE");

  useEffect(() => {
    if (isPaystackEnabled) setActivePaymentMethod("PAYSTACK");
    else if (isOfflineEnabled) setActivePaymentMethod("OFFLINE");
    else setActivePaymentMethod(null);
  }, [isPaystackEnabled, isOfflineEnabled]);

  const handleParentSubmit = () => {
    if (submitHandler) {
      setIsPaymentLoading(true);
      submitHandler().finally(() => setIsPaymentLoading(false));
    }
  };

  const handleSubmit = async () => {
    if (activePaymentMethod === "PAYSTACK") {
      handleParentSubmit();
      return;
    }

    if (activePaymentMethod === "OFFLINE") {
      setIsPaymentLoading(true);
      await transitionOrderToOfflinePaymentMutation.mutateAsync(
        { eventId, orderShortId },
        {
          onSuccess: () => navigate(`/checkout/${eventId}/${orderShortId}/summary`),
          onError: (error: any) => {
            setIsPaymentLoading(false);
            showError(
              error.response?.data?.message ||
                "Offline payment failed. Please try again or contact the event organizer."
            );
          },
        }
      );
    }
  };

  // ✅ include Paystack in the “no methods” guard
  if (!isPaystackEnabled && !isOfflineEnabled && isOrderFetched && isEventFetched) {
    return (
      <CheckoutContent>
        <Card>
          No payment methods are currently available. Please contact the event organizer for assistance.
        </Card>
      </CheckoutContent>
    );
  }

  return (
    <>
      <CheckoutContent>
        {isPaystackEnabled && (
          <div style={{ display: activePaymentMethod === "PAYSTACK" ? "block" : "none" }}>
            <PaystackPaymentMethod enabled={true} setSubmitHandler={setSubmitHandler} />
          </div>
        )}

        {isOfflineEnabled && (
          <div style={{ display: activePaymentMethod === "OFFLINE" ? "block" : "none" }}>
            <OfflinePaymentMethod event={event as Event} />
          </div>
        )}

        {isPaystackEnabled && isOfflineEnabled && (
          <div style={{ marginTop: 20 }}>
            <a
              onClick={() => setActivePaymentMethod(activePaymentMethod === "PAYSTACK" ? "OFFLINE" : "PAYSTACK")}
              style={{ cursor: "pointer" }}
            >
              {activePaymentMethod === "PAYSTACK"
                ? "I would like to pay using an offline method"
                : "I would like to pay using Paystack (Nigerian cards, etc.)"}
            </a>
          </div>
        )}
      </CheckoutContent>

      <CheckoutFooter
        event={event as Event}
        order={order as Order}
        isLoading={isLoading || isPaymentLoading}
        onClick={handleSubmit}
        buttonContent={
          order?.is_payment_required ? (
            <Group gap={"10px"}>
              <div style={{ fontWeight: "bold" }}>Place Order</div>
              <div style={{ fontSize: 14 }}>{formatCurrency(order.total_gross, order.currency)}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{order.currency}</div>
            </Group>
          ) : (
            "Complete Payment"
          )
        }
      />
    </>
  );
};

export default Payment;
