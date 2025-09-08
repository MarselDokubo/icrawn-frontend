// src/pages/PaystackCallback.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaystackCallback() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying"|"success"|"failed">("verifying");
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const reference = search.get("reference") || search.get("trxref");
    const eventId = search.get("event_id");
    const orderShortId = search.get("order_short_id");

    if (!reference || !eventId || !orderShortId) {
      setStatus("failed");
      setMessage("Missing payment details in callback URL.");
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/public/events/${eventId}/order/${orderShortId}/paystack/verify/${reference}`,
          { credentials: "include" } // keeps session cookie if any
        );
        const data = await res.json();

        if (res.ok && data.verified) {
          setStatus("success");
          setMessage("Payment verified. Redirecting...");
          // send the user to your existing order confirmation page
          setTimeout(() => navigate(`/checkout/${eventId}/${orderShortId}/summary`), 1200);
        } else {
          setStatus("failed");
          setMessage(data.message || "Verification failed.");
        }
      } catch (e:any) {
        setStatus("failed");
        setMessage(e?.message || "Network error during verification.");
      }
    })();
  }, [search, navigate]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Completing your payment…</h1>
      <p>{message}</p>
      {status === "failed" && (
        <button onClick={() => window.location.href = "/"}>Go home</button>
      )}
    </div>
  );
}
