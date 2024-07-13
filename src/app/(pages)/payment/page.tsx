"use client";

import CheckoutPage from "@/components/payments/CheckoutPage";
import { useAppSelector } from "@/redux/hook";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Payment() {
  const { subtotal: amount } = useAppSelector((state) => state.cart);


  return (
    <main className="max-w-md mx-auto p-10 border m-10 rounded-md shadow-md">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Payment</h1>
        <h2 className="text-2xl text-center">
          has requested
          <span className="font-bold"> ${amount}</span>
        </h2>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutPage amount={amount} />
      </Elements>
    </main>
  );
}
