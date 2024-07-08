"use client";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "@/redux/features/product/product.api";
import { useState } from "react";
import { toast } from "sonner";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import uploadImage from "@/utils/imageUploadByFetch";
import Image from "next/image";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetAllBrandsQuery } from "@/redux/features/brand/brand.api";
import { useGetAllTagsQuery } from "@/redux/features/tag.api";
import { LuUploadCloud } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import Loading from "@/app/loading";

interface FormState {
  name: string;
  photo: string;
  category: { _id: string; label: string };
  description: string;
  stock: number;
  price: number;
  discountPrice: number;
  brand: { _id: string; label: string };
  service: string | object;
  tag: { _id: string; label: string };
}

const ManageProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const {
    data: products,
    error,
    isLoading,
  } = useGetAllProductsQuery({
    page: currentPage,
    limit: pageSize,
  });
  const [createProduct] = useCreateProductMutation();
  const [updateProduct, { isSuccess: successUpdate, error: errorupdate }] =
    useUpdateProductMutation();
  const [deleteProduct, { isSuccess: isSuccessDel, isLoading: isLoadingDel }] =
    useDeleteProductMutation();

  const { data: categories } = useGetAllCategoriesQuery(undefined);
  const { data: brands } = useGetAllBrandsQuery(undefined);
  const { data: tags } = useGetAllTagsQuery(undefined);

  const [form, setForm] = useState<FormState>({
    name: "",
    photo: "",
    category: { _id: "", label: "" },
    description: "",
    stock: 0,
    price: 0,
    discountPrice: 0,
    brand: { _id: "", label: "" },
    service: "",
    tag: { _id: "", label: "" },
  });
  const [userPic, setUserPic] = useState<string | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProduct({ id: editId, ...form, photo: userPic });
        setIsEditing(false);
        setEditId(null);
      } else {
        await createProduct({ ...form, photo: userPic });
      }
      setForm({
        name: "",
        photo: "",
        category: { _id: "", label: "" },
        description: "",
        stock: 0,
        price: 0,
        discountPrice: 0,
        brand: { _id: "", label: "" },
        service: "",
        tag: { _id: "", label: "" },
      });
      setUserPic("");
      setModalIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (successUpdate) {
    toast.success("Product Updated SuccessFully", { id: "update-ok" });
  }
  if (errorupdate) {
    toast.error("Product Updated SuccessFully", { id: "update-error" });
  }

  const handleEdit = (product: any) => {
    setForm(product);
    setUserPic(product.photo);
    setIsEditing(true);
    setEditId(product._id);
    setModalIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <div className="center w-full h-[200px]">
        <Loading />
      </div>
    );
  if (isSuccessDel) {
    toast.success("Deleted Successfully", { id: "del-product-" });
  }

  if (error) return <p>Error: {(error as { message: string }).message}</p>;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <div className="min-h-[300px]">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Stock</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.data.length > 0 ? (
              products?.data?.map((product: any) => (
                <tr key={product._id}>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b  line-clamp-2">{product.description}</td>
                  <td className="py-2 px-4 border-b">{product.stock}</td>
                  <td className="py-2 px-4 border-b">{product.price}</td>
                  <td className="py-2 px-4 border-b flex gap-[10px]">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => handleEdit(product)}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDelete(product._id)}
                    >
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <div className="text-center w-full text-borderDark text-xl pt-[40px]">
                No Data Found
              </div>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {products?.data?.length} of {products?.total || 0} products
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={` px-4 py-2 text-white rounded ${
              currentPage > 1
                ? "bg-primaryMat"
                : "cursor-not-allowed bg-gray-200"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={` px-4 py-2 text-white rounded ${
              products?.data?.length === pageSize
                ? "bg-primaryMat"
                : "cursor-not-allowed bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full h-[600px] overflow-auto smoothBar">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold mb-4">
                {isEditing ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setModalIsOpen(false)} className="">
                <MdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="">
                <label htmlFor="">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={form.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full p-2 mb-4 border rounded"
                  required
                />
              </div>
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
              <select
                name="category"
                defaultValue={form.category._id}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border rounded"
                required
              >
                <option value={form.category?._id! as string}>
                  {form.category.label! as string}
                </option>
                {categories?.data?.map((category: any) => (
                  <option key={category._id} value={category._id}>
                    {category.label}
                  </option>
                ))}
              </select>
              <div className="">
                <label htmlFor="">Description</label>
                <textarea
                  name="description"
                  defaultValue={form.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="w-full p-2 mb-4 border rounded"
                  required
                ></textarea>
              </div>
              <div className="">
                <label htmlFor="">Stock</label>
                <input
                  type="number"
                  name="stock"
                  defaultValue={form.stock}
                  onChange={handleInputChange}
                  placeholder="Stock"
                  className="w-full p-2 mb-4 border rounded"
                  required
                />
              </div>
              <div className="">
                <label htmlFor="">Price</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={form.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="w-full p-2 mb-4 border rounded"
                  required
                />
              </div>
              <div className="">
                <label htmlFor="">Discount Price</label>
                <input
                  type="number"
                  name="discountPrice"
                  defaultValue={form.discountPrice}
                  onChange={handleInputChange}
                  placeholder="Discount Price"
                  className="w-full p-2 mb-4 border rounded"
                  required
                />
              </div>
              <select
                name="brand"
                defaultValue={form.brand._id}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border rounded"
                required
              >
                <option value={form.brand?._id! as string}>
                  {form.brand.label}
                </option>
                {brands?.data?.map((brand: any) => (
                  <option key={brand?._id} value={brand?._id}>
                    {brand.label}
                  </option>
                ))}
              </select>
              <select
                name="tag"
                defaultValue={form.tag?._id}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border rounded"
                required
              >
                <option value={form.tag?._id! as string || ""}>
                  {form.tag?.label || "select tag"}
                </option>
                {tags?.data?.map((tag: any) => (
                  <option key={tag?._id} value={tag?._id}>
                    {tag?.label}
                  </option>
                ))}
              </select>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setModalIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {isEditing ? "Update" : "Add"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
