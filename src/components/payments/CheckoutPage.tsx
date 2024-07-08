"use client";

import CheckoutForm from "./CheckoutForm";
import StripeProvider from "./StripeProvider";

const CheckoutPage = () => {
  return (
    <StripeProvider>
      <CheckoutForm />
    </StripeProvider>
  );
};

export default CheckoutPage;
