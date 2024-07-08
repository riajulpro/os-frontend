"use client";

import ConfirmOrder from "@/components/client/ConfirmOrder";
import { useAppSelector } from "@/redux/hook";
import { SquareCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CheckoutPage = ({
  searchParams: { subtotal, total, deliveryCharge },
}: {
  searchParams: {
    subtotal: string;
    total: string;
    deliveryCharge: string;
  };
}) => {
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const pathUrl = `/checkout&subtotal=${subtotal}&total=${total}&deliveryCharge=${deliveryCharge}`;

  useEffect(() => {
    if (!token) {
      return router.push(`/login?redirect=${pathUrl}`);
    }
  }, [token, router, pathUrl]);

  return (
    <div className="min-h-screen p-3 lg:py-8 xl:max-w-7xl xl:mx-auto">
      <div className="mx-w-lg p-5 rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-md border">
          <h2 className="text-3xl font-semibold bg-gray-50 py-2 px-5">
            Payable Amount: <span className="font-bold">${total}</span>
          </h2>
          <div className="px-5 py-2">
            <div className="flex flex-col gap-3 items-stretch">
              <h3 className="text-lg font-semibold">Payment method: </h3>
              <div className="flex gap-3 w-full text-lg font-bold p-3 border rounded-sm bg-gray-50">
                <SquareCheck className="bg-green-600 text-white" />
                Cash on Delivery (COD)
              </div>
              <ConfirmOrder total={total} />
            </div>
          </div>
        </div>
        <div className="bg-white w-full rounded-md border p-5">
          <h3 className="text-lg font-bold">Payment Summary</h3>
          <p className="border-b py-2 flex justify-between gap-1 items-center">
            <span className="font-semibold">Subtotal:</span>
            <span className="text-xl font-bold text-green-500">
              ${subtotal}
            </span>
          </p>
          <p className="border-b py-2 flex justify-between gap-1 items-center">
            <span className="font-semibold">Delivery Charge:</span>
            <span className="text-xl font-bold text-green-500">
              {Number(deliveryCharge) > 0 ? deliveryCharge : "Free"}
            </span>
          </p>
          <p className="mb-5 py-2 flex justify-between gap-1 items-center">
            <span className="font-semibold">Total:</span>
            <span className="text-xl font-bold text-green-500">${total}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
