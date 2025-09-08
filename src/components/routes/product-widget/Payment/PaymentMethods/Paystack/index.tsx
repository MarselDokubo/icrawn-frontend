// frontend/src/components/routes/product-widget/Payment/PaymentMethods/Paystack.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { TextInput } from "@mantine/core";
import { useGetOrderPublic } from "@/queries/useGetOrderPublic";
import { showError } from "@/utilites/notifications";

type Props = {
  enabled: boolean;
  setSubmitHandler: (fn: () => Promise<void>) => void;
};

export const PaystackPaymentMethod: React.FC<Props> = ({ enabled, setSubmitHandler }) => {
  const { eventId, orderShortId } = useParams();
  const { data: order } = useGetOrderPublic(eventId, orderShortId, []);
  const [emailOverride, setEmailOverride] = useState("");

  const effectiveEmail = useMemo(() => {
    return (order?.email || "").trim() || emailOverride.trim();
  }, [order?.email, emailOverride]);

  useEffect(() => {
    setSubmitHandler(async () => {
      if (!enabled) return;

      if (!eventId || !orderShortId) {
        showError("Missing event/order identifiers.");
        return;
      }

    //   if (!effectiveEmail) {
    //     showError("Please enter your email to continue.");
    //     return;
    //   }

      try {
        const sessionId = localStorage.getItem("session_identifier");

        console.log("Inside initialize payment", sessionId)
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/public/events/${eventId}/order/${orderShortId}/paystack/initialize?session_identifier=${sessionId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: effectiveEmail }),
          }
        );

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Failed to initialize Paystack.");

        // Redirect to Paystack
        console.log("Redirecting to Paystack:", data.authorization_url);
        window.location.href = data.authorization_url;
      } catch (e: any) {
        showError(e?.message || "Could not start Paystack payment.");
      }
    });
  }, [enabled, setSubmitHandler, eventId, orderShortId, effectiveEmail]);

  if (!order?.email) {
    return (
      <div>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          value={emailOverride}
          onChange={(e) => setEmailOverride(e.currentTarget.value)}
          required
        />
        <p style={{ marginTop: 8, fontSize: 13 }}>
          We’ll use your email to create your order and send your tickets.
        </p>
      </div>
    );
  }

  return <p>Pay with Paystack using <strong>{order.email}</strong>.</p>;
};
