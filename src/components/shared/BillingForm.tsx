"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "@/redux/hook";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BillingFormValues {
  address: string;
  city: string;
  contact: string;
  postalCode: string;
  country: string;
}

const BillingForm: React.FC = () => {
  const [available, setAvailable] = useState<BillingFormValues | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const getBillingInfo = async () => {
      if (!user || !user._id) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/billing/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        const data = await res.json();
        console.log(data);
        setAvailable(data.data || null);
      } catch (error: any) {
        console.log("Fetch error: ", error.message);
      }
    };

    getBillingInfo();
  }, [user]);

  const validationSchema = Yup.object({
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    contact: Yup.string().required("Contact is required"),
    postalCode: Yup.string().required("Postal Code is required"),
    country: Yup.string().required("Country is required"),
  });

  const onSubmit = async (values: BillingFormValues) => {
    const body = {
      user: user?._id,
      ...values,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (result.success) {
      router.push("/payment");
    }
  };

  return (
    <Formik
      initialValues={{
        address: available?.address || "",
        city: available?.city || "",
        contact: available?.contact || "",
        postalCode: available?.postalCode || "",
        country: available?.country || "",
      }}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form className="max-w-md mx-auto p-5 my-20 bg-white border rounded-md shadow-md">
        <div className="mb-5">
          <h1 className="text-3xl font-bold">Billing Information</h1>
          <p className="text-sm text-slate-700">
            You should add your billing Information
          </p>
        </div>
        <div className="mb-2">
          <label htmlFor="address" className="label-style">
            Address
          </label>
          <Field name="address" type="text" className="input-style rounded" />
          <ErrorMessage
            name="address"
            component="div"
            className="error-message"
          />
        </div>
        <div className="flex gap-1 mb-2">
          <div className="flex-1">
            <label htmlFor="city" className="label-style">
              City
            </label>
            <Field name="city" type="text" className="input-style rounded" />
            <ErrorMessage
              name="city"
              component="div"
              className="error-message"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="postalCode" className="label-style">
              Postal Code
            </label>
            <Field
              name="postalCode"
              type="text"
              className="input-style rounded"
            />
            <ErrorMessage
              name="postalCode"
              component="div"
              className="error-message"
            />
          </div>
        </div>

        <div className="mb-2">
          <label htmlFor="contact" className="label-style">
            Contact
          </label>
          <Field name="contact" type="text" className="input-style rounded" />
          <ErrorMessage
            name="contact"
            component="div"
            className="error-message"
          />
        </div>

        <div>
          <label htmlFor="country" className="label-style">
            Country
          </label>
          <Field name="country" type="text" className="input-style rounded" />
          <ErrorMessage
            name="country"
            component="div"
            className="error-message"
          />
        </div>

        {available ? (
          <Link href="/payment">
            <button className="submit-btn mt-5 mb-0">Continue</button>
          </Link>
        ) : (
          <button type="submit" className="submit-btn mt-5 mb-0">
            Continue
          </button>
        )}
      </Form>
    </Formik>
  );
};

export default BillingForm;
