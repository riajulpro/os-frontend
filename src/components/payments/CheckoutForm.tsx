"use client";

import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 1000 }),
    });
    const result = await res.json();

    const cardElement = elements!.getElement(CardElement) as StripeCardElement;

    const stripeResponse = await stripe!.confirmCardPayment(
      result.clientSecret!,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    console.log(stripeResponse);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        Pay
      </button>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
    </form>
  );
};

export default CheckoutForm;
