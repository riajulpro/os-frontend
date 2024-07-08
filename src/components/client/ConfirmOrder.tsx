"use client";

import { useAppSelector } from "@/redux/hook";
import { Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ConfirmOrder = ({ total }: { total: string }) => {
  const { cart: cartItems } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  if (user?.role === "owner") router.push("/profile");

  const sellData = cartItems.map((cart) => ({
    productId: cart.id,
    quantity: cart.quantity,
  }));

  const handleConfirm = async () => {
    const body = {
      sellData: sellData,
      totalAmount: Number(total),
      paymentMethod: "COD",
      customer: user?._id,
      date: Date.now(),
    };

    console.log("Order body: ", body);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sell`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!result.success) {
        return toast.error("Order failed!");
      }
      toast.success("Order successfullly created!");

      console.log("order response: ", result);

      router.push("/");
    } catch (error: any) {
      console.log("Confirm error: ", error.message);
      toast.error(error.message);
    }
  };

  return (
    <button
      onClick={handleConfirm}
      className="self-end bg-green-500 hover:bg-green-600 rounded-md text-white font-medium p-3 center gap-2 w-fit"
    >
      Confirm Order <Banknote />
    </button>
  );
};

export default ConfirmOrder;
