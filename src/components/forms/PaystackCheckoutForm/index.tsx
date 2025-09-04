import { useState } from "react";
import { useParams } from "react-router";
import { Button, Alert } from "@mantine/core";

import { orderClientPublic } from "../../../api/order.client";

export default function PaystackCheckoutForm() {
    const { eventId, orderShortId } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState<number>(0);

    const handlePaystack = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await orderClientPublic.initializePaystackPayment(
                Number(eventId),
                String(orderShortId),
                email,
                amount
            );
            window.location.href = result.authorization_url;
        } catch (e: any) {
            setError(e?.message || `Unable to initialize Paystack payment.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{`Pay with Paystack`}</h2>
            <input
                type="email"
                placeholder={`Email`}
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="number"
                placeholder={`Amoun`}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
            />
            <Button onClick={handlePaystack} loading={loading} color="green">
                {`Pay Now`}
            </Button>
            {error && <Alert color="red">{error}</Alert>}
        </div>
    );
}
