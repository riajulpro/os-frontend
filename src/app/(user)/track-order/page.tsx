"use client";
import PopUpModal from "@/components/ui/PopUpModal";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAppSelector } from "@/redux/hook";
import { IProduct } from "@/types/product";
import { IOrder } from "@/types/sell";
import { getOrderProgresCode } from "@/utils/getOrderProggresCode";
import { format } from "date-fns";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useState } from "react";
import { BsCalendar2Event } from "react-icons/bs";
import { MdDiscount } from "react-icons/md";
import { toast } from "sonner";
import * as Yup from "yup";

const validationSchema = Yup.object({
  orderId: Yup.string()

    .required("Order ID is required")
    .test("is-valid-object-id", "Invalid order id format", (value) => {
      const regEx = /^[0-9a-fA-F]{24}$/;
      return regEx.test(value);
    }),
});

const TrackOrder = () => {
  const [show, setShow] = useState(false);
  const [orderData, setOrderData] = useState<IOrder>();
  const { token } = useAppSelector((state) => state.auth);

  const handleSubmit = async (value: { orderId: string }) => {
    const toastId = toast.loading("Please wait");
    try {
      const url = process.env.NEXT_PUBLIC_API_URL as string;
      const res = await fetch(`${url}/sell/my/order/${value.orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        return toast.error("Something went wrong2");
      }
      const data = (await res.json()) || {};

      if (!data.success) {
        return toast.error("something went wrong while tracking this order");
      }

      if (data.data) {
        setShow(true);
        setOrderData(data.data);
      }
    } catch (error) {
      toast.error("Somtething went wrong");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded w-full">
        <h2 className="text-2xl font-bold mb-6">Orders tracking</h2>
        <p className="mb-6">
          To track your order please enter your Order ID in the box below and
          press &quot;Track&quot; button. This was given to you on your receipt
          and in the confirmation email you should have received.
        </p>
        <Formik
          initialValues={{ orderId: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="orderId" className="block text-primaryTxt">
                  Order ID
                </label>
                <Field
                  id="orderId"
                  name="orderId"
                  type="text"
                  className={`mt-1 outline-none block w-full p-2 border rounded ${
                    touched.orderId && errors.orderId
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="orderId"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primaryMat text-white p-2 rounded"
              >
                Track
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <PopUpModal setState={setShow} state={show}>
        <div className="w-[90vw] sm:w-[700px] bg-white border-[1px] border-borderColor p-[15px]  rounded-[8px]">
          <div className="flex flex-col gap-[20px]">
            {orderData?.sellData?.map((order) => (
              <>
                <div className="w-full flex items-start justify-start gap-[20px]">
                  <Image
                    src={(order?.productId as IProduct)?.photo || "/"}
                    width={150}
                    height={70}
                    className="rounded-[8px]"
                    alt="product"
                  />
                  <div className="flex flex-col gap-[5px] items-start justify-start">
                    <h1 className="text-[20px] font-[600] text-primaryTxt">
                      {(order?.productId as IProduct)?.name}
                    </h1>
                    <p className="text-primaryTxt w-full flex gap-[2px]">
                      <span className="font-[600] center gap-[5px] w-fit">
                        <BsCalendar2Event /> Order date:
                      </span>
                      {format(orderData?.date || "2023-07-02", "MMM dd")}
                    </p>
                    <p className="text-primaryTxt w-full flex gap-[2px]">
                      <span className="font-[600] center gap-[5px] w-fit">
                        <MdDiscount /> Quantity:
                      </span>
                      {order?.quantity} pcs
                    </p>
                  </div>
                </div>
                <div className="w-full hidden sm:flex">
                  <ProgressBar
                    currentStep={
                      getOrderProgresCode(orderData.status || "Pending") + 1
                    }
                  />
                </div>
              </>
            ))}
          </div>
          <button
            onClick={() => setShow(false)}
            className="py-[8px] mt-[20px] w-full bg-primaryMat text-white rounded-[5px]"
          >
            Close
          </button>
        </div>
      </PopUpModal>
    </div>
  );
};

export default TrackOrder;
