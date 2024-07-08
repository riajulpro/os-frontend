"use client";

import CheckoutPage from "@/components/payments/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useAppSelector } from "@/redux/hook";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Payment() {
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      Cookies.set("redirect", "/payment");
      return router.push("/login");
    }
  }, [token, router]);

  const amount = 49.99;

  return (
    <main className="max-w-md mx-auto p-10 text-center border m-10 rounded-md shadow-md">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Payment</h1>
        <h2 className="text-2xl">
          has requested
          <span className="font-bold"> ${amount}</span>
        </h2>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "usd",
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </main>
  );
}
