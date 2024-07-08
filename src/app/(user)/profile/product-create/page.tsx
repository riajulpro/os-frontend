"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetAllBrandsQuery } from "@/redux/features/brand/brand.api";
import { useGetAllTagsQuery } from "@/redux/features/tag.api";
import { useCreateProductMutation } from "@/redux/features/product/product.api";
import { toast } from "sonner";
import uploadImage from "@/utils/imageUploadByFetch";
import { LuUploadCloud } from "react-icons/lu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

const ProductForm: React.FC = () => {
  const [createProduct, { isLoading, isSuccess, isError, error }] =
    useCreateProductMutation(undefined);
  const { data: categories } = useGetAllCategoriesQuery(undefined);
  const { data: brands } = useGetAllBrandsQuery(undefined);
  const { data: tags } = useGetAllTagsQuery(undefined);
  const [userPic, setUserPic] = useState<string | undefined>();

  const router = useRouter();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const toastid = toast.loading("Please wait updating your image...");

    try {
      if (file) {
        const imageUrl = await uploadImage(file, userPic || "");
        setUserPic(imageUrl?.url as string);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      toast.dismiss(toastid);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      description: "",
      stock: 0,
      price: 0,
      discountPrice: 0,
      brand: "",
      tag: "",
      service: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      category: Yup.string().required("Required"),
      stock: Yup.number().required("Required").min(1, "Must be at least 1"),
      price: Yup.number().required("Required").min(0, "Must be at least 0"),
      discountPrice: Yup.number()
        .required("Required")
        .min(0, "Must be at least 0"),
      description: Yup.string().required("Required"),
      brand: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        if (values.category) {
          const categoryVal = categories.data.find(
            (category: { value: string }) => category.value === values.category
          );
          values.category = categoryVal._id;
        }
        if (values.brand) {
          const brandVal = brands.data.find(
            (brand: { value: string }) => brand.value === values.brand
          );
          values.brand = brandVal._id;
        }
        if (values.tag) {
          const tagVal = tags.data.find(
            (tag: { value: string }) => tag.value === values.tag
          );
          values.tag = tagVal._id;
        }

        console.log("values", { ...values, photo: userPic });

        await createProduct({ ...values, photo: userPic }).unwrap();
        setUserPic("");
        formik.resetForm();
        router.push("/profile/manage-product");
      } catch (error) {
        console.error("Failed to create product:", error);
      }
    },
  });

  return (
    <div className="p-5 w-full md:w-[600px] md:ml-[40px] border">
      <h2 className="text-xl font-bold mb-3">Create Product</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border p-2 rounded"
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="profile">
            <input
              id="profile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="relative group overflow-hidden rounded-md">
              {userPic ? (
                <Image
                  src={userPic || "/images/profileicon.png"}
                  alt="profile pic"
                  height={400}
                  width={400}
                  className="w-full h-[250px] rounded-md object-cover border border-primary inline-block"
                />
              ) : (
                <div className="w-full h-[250px] rounded-md border border-primary center bg-gray-300 font-bold">
                  Upload image
                </div>
              )}

              <div className="bg-black/25 absolute inset-0 z-10 scale-150 group-hover:scale-100 opacity-0 group-hover:opacity-100 duration-150 flex items-center justify-center cursor-pointer">
                <LuUploadCloud className="text-white text-2xl" />
              </div>
            </div>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border p-2 rounded"
          >
            <option value="" label="Select category" />
            {categories?.data.map((category: any) => (
              <option
                key={category.value}
                value={category.value}
                label={category.label}
              />
            ))}
          </select>
          {formik.touched.category && formik.errors.category ? (
            <div className="text-red-500 text-sm">{formik.errors.category}</div>
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border p-2 rounded"
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          ) : null}
        </div>
        <div className="">
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            value={formik.values.stock}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border p-2 rounded"
          />
          {formik.touched.stock && formik.errors.stock ? (
            <div className="text-red-500 text-sm">{formik.errors.stock}</div>
          ) : null}
        </div>
        <div className="grid  grid-cols-1 md:grid-cols-2 gap-[10px]">
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border p-2 rounded"
            />
            {formik.touched.price && formik.errors.price ? (
              <div className="text-red-500 text-sm">{formik.errors.price}</div>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium">Discount Price</label>
            <input
              type="number"
              name="discountPrice"
              value={formik.values.discountPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border p-2 rounded"
            />
            {formik.touched.discountPrice && formik.errors.discountPrice ? (
              <div className="text-red-500 text-sm">
                {formik.errors.discountPrice}
              </div>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          <div>
            <label className="block text-sm font-medium">Brand</label>
            <select
              name="brand"
              value={formik.values.brand}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border p-2 rounded"
            >
              <option value="" label="Select brand" />
              {brands?.data.map((brand: any) => (
                <option
                  key={brand.value}
                  value={brand.value}
                  label={brand.label}
                />
              ))}
            </select>
            {formik.touched.brand && formik.errors.brand ? (
              <div className="text-red-500 text-sm">{formik.errors.brand}</div>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium">Tag</label>
            <select
              name="tag"
              value={formik.values.tag}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border p-2 rounded"
            >
              <option value="" label="Select tag" />
              {tags?.data?.map((tag: any) => (
                <option key={tag.value} value={tag.value} label={tag.label} />
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Service</label>
          <input
            type="text"
            name="service"
            value={formik.values.service}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="mt-3 px-4 py-2 bg-primaryMat/95 hover:bg-primaryMat text-white rounded"
        >
          {isLoading ? <Loading /> : "Create Product"}
        </button>
        {isError && (
          <div className="text-red-500 text-sm">
            {(error as any)?.data?.message}
          </div>
        )}
        {isSuccess && (
          <div className="text-primaryMat text-sm">
            Product created successfully
          </div>
        )}
      </form>
    </div>
  );
};

export default ProductForm;
