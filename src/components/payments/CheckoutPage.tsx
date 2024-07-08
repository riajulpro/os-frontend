"use client";

import CheckoutForm from "./CheckoutForm";
import StripeProvider from "./StripeProvider";

const CheckoutPage = () => {
  return (
    <StripeProvider>
      <CheckoutForm amount={10} />
    </StripeProvider>
  );
};

export default CheckoutPage;
