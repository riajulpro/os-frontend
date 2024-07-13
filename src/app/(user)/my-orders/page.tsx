"use client";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import PopUpModal from "@/components/ui/PopUpModal";
import { useGetUserOrderHistroyQuery } from "@/redux/features/sell/sell.api";
import { IProduct } from "@/types/product";
import { IOrder, ISellData } from "@/types/sell";
import { format } from "date-fns";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { BsCalendar2Event } from "react-icons/bs";
import { MdDiscount } from "react-icons/md";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

const OrderHistory: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetUserOrderHistroyQuery({ page });
  const [showModal, setShowModal] = useState<boolean | string>(false);
  const [selectedProduct, setSelectedProduct] = useState<ISellData[] | null>();
  const [, copy] = useCopyToClipboard();
  if (isLoading) {
    return (
      <div className="w-full h-full center">
        <Loading />
      </div>
    );
  }
  const handleCopyText = async (text: string) => {
    await copy(text);
    toast.success(`${text} Copied to the clipboard`);
  };
  return (
    <div className="container mx-auto my-8">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-start">Order</th>
            <th className="py-2 px-4 border-b text-start">Date</th>
            <th className="py-2 px-4 border-b text-start">Status</th>
            <th className="py-2 px-4 border-b text-start">Total</th>
            <th className="py-2 px-4 border-b text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((order: IOrder) => {
            const orderDate = new Date(order.date);
            const dateStr = format(orderDate, "MMM, dd");
            return (
              <tr key={order._id}>
                <td
                  className="py-2 px-4 border-b text-start cursor-pointer hover:underline"
                  onClick={() => handleCopyText(order._id)}
                >
                  #{order._id}
                </td>
                <td className="py-2 px-4 border-b text-start">{dateStr}</td>
                <td className="py-2 px-4 border-b text-start">
                  Completed
                </td>{" "}
                {/* Hardcoded for simplicity */}
                <td className="py-2 px-4 border-b text-start">
                  ${order.totalAmount.toFixed(2)} for {order.sellData.length}{" "}
                  item
                  {order.sellData.length > 1 ? "s" : ""}
                </td>
                <td
                  onClick={() => {
                    setShowModal(true);
                    setSelectedProduct(order.sellData);
                  }}
                  className="py-2 px-4 border-b text-blue-500 cursor-pointer"
                >
                  View
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-start gap-[5px] mt-[10px]">
        <p className="text-[18px] font-[500] text-primaryTxt">page:</p>
        {Array.from({ length: Math.ceil(data?.totalDoc / 10 || 1) }).map(
          (_, i) => (
            <button
              onClick={() => setPage(i + 1)}
              key={i + "order page"}
              className={`p-[8px] w-[30px] h-[30px] center rounded-[8px] ${
                page === i + 1
                  ? "bg-primaryMat text-white"
                  : "bg-slate-300 text-primaryTxt"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      <PopUpModal
        state={!!showModal}
        setState={setShowModal as React.Dispatch<SetStateAction<boolean>>}
      >
        <div className="relative top-20 mx-auto p-5 border w-[770px] shadow-lg rounded-md bg-white">
          <div>
            {selectedProduct?.map((orderData) => (
              <>
                <div className="mt-3 text-center">
                  <div className="w-full flex items-start justify-start gap-[20px]">
                    <Image
                      src={(orderData?.productId as IProduct)?.photo || "/"}
                      width={150}
                      height={70}
                      className="rounded-[8px]"
                      alt="product"
                    />
                    <div className="flex flex-col gap-[5px] items-start justify-start">
                      <h1 className="text-[20px] font-[600] text-primaryTxt">
                        {(orderData?.productId as IProduct)?.name}
                      </h1>
                      <p className="text-primaryTxt w-full flex gap-[2px]">
                        <span className="font-[600] center gap-[5px] w-fit">
                          <BsCalendar2Event /> Order date:
                        </span>
                        {format(data.data.date || "2023-07-02", "MMM dd")}
                      </p>
                      <p className="text-primaryTxt w-full flex gap-[2px]">
                        <span className="font-[600] center gap-[5px] w-fit">
                          <MdDiscount /> Quantity:
                        </span>
                        {orderData?.quantity} pcs
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ))}
            <div className="items-center px-4 py-3">
              <Button
                className="px-4 py-2 bg-primaryMat hover:bg-green-600 text-white text-base font-medium rounded-md w-full"
                onClick={() => {
                  setSelectedProduct(null);
                  setShowModal(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </PopUpModal>
    </div>
  );
};

export default OrderHistory;
