"use client";

import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { clearCart } from "@/redux/features/cart/cart.slice";
import { useCreateOrderMutation } from "@/redux/features/sell/sell.api";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { cart, subtotal } = useAppSelector((stae) => stae.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [createOrder] = useCreateOrderMutation();
  console.log(cart);
  const dispatch = useAppDispatch();

  // sellData,
  // totalAmount,
  // paymentMethod,
  // paymentStatus,
  // customer,
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }
    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      toast.error("Carn is not available");
      return;
    }
    try {
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        const payload = {
          sellData: cart,
          paymentMethod: "card",
          paymentStatus: "paid",
          customer: user?._id,
          totalAmount: amount,
        };

        const order = await createOrder(payload);

        dispatch(clearCart());
        Cookies.remove("redirect");
        router.push(`/payment-success?amount=${amount}`);
      }

      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && (
        <div className="flex flex-col gap-[8px] w-full">
          <label htmlFor="card-nr" className="label">
            Card number
          </label>
          <div className="px-[20px] w-full flex justify-center items-center h-[50px] border-[1px] border-[#E2E8F0] rounded-[15px]">
            <CardNumberElement
              id="card-nr"
              className="text-[16px] font-[500] bg-white w-full text-[#B4BFCD]"
            />
          </div>
          <div className="flex items-start justify-start gap-[22px] w-full mt-[20px]">
            <div className="flex flex-col gap-[8px] w-full">
              <label htmlFor="card-ex" className="label">
                Card expiry
              </label>
              <div className="px-[20px] w-full flex justify-center items-center h-[50px] border-[1px] border-[#E2E8F0] rounded-[15px]">
                <CardExpiryElement
                  id="card-ex"
                  className="text-[16px] font-[500] bg-white w-full text-[#B4BFCD]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[8px] w-full">
              <label htmlFor="card-cv" className="label">
                CVC
              </label>
              <div className="px-[20px] w-full flex justify-center items-center h-[50px] border-[1px] border-[#E2E8F0] rounded-[15px]">
                <CardCvcElement
                  id="card-cv"
                  className="text-[16px] font-[500] bg-white w-full text-[#B4BFCD]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {errorMessage && <div>{errorMessage}</div>}

      <button
        disabled={!stripe || loading}
        className="text-white w-full p-3 bg-green-500 mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;
