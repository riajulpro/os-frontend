"use client";

import BillingForm from "@/components/shared/BillingForm";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";

const BillingInfoPage = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { subtotal: amount } = useAppSelector((state) => state.cart);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      Cookies.set("redirect", "/billing-info");
      return router.push("/login");
    }
  }, [token, router]);

  return (
    <div className="p-3 lg:p-0">
      <BillingForm />
    </div>
  );
};

export default BillingInfoPage;
