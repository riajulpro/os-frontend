"use client";

import { deleteCart, updateQuantity } from "@/redux/features/cart/cart.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Banknote, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CartView = () => {
  const { cart: cartItems, subtotal } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const delivery = 0;
  const total = (subtotal + delivery).toFixed(2);
  const subtotalValue = subtotal.toFixed(2);

  const handleDelete = (id: string) => {
    console.log("Deleting item with id:", id);
    dispatch(deleteCart({ id }));
  };

  const handleQuantityChange = (id: string, quantity: string) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  return (
    <div className="min-h-screen">
      {" "}
      <div className="layout_container py-5 lg:py-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-5">
        <div className="md:col-span-2 lg:col-span-3 border">
          <div className="px-3 font-medium py-5 bg-gray-50 flex gap-5 items-center justify-between">
            <div className="w-[121px]">Photo</div>
            <div className="flex-1">Title and Rating</div>
            <div className="w-[70px]">Price</div>
            <div className="w-[70px]">Quantity</div>
            <div className="w-[70px]">Subtotal</div>
            <div className="w-[70px]">Action</div>
          </div>
          {cartItems.length > 0 ? (
            cartItems.map((item, i): any => (
              <div
                key={i}
                className="border-b py-2 px-3 flex items-stretch gap-5 justify-between"
              >
                <div className="border p-5 center rounded-md">
                  <Image
                    src="/images/product.jpg"
                    alt="Product Image"
                    height={100}
                    width={80}
                    className=""
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold pt-2">{item.name}</p>
                  <p>Ratings: {item.rating}</p>
                </div>
                <div className="w-[70px] self-center">${item.price}</div>
                <div className="w-[70px] self-center">
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    defaultValue={item.quantity}
                    className="border w-16 p-2"
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                  />
                </div>
                <div className="w-[70px] self-center">
                  ${item.price * parseInt(item.quantity)}
                </div>
                <div className="w-[70px] self-center">
                  <button onClick={() => handleDelete(item.id)}>
                    <Trash className="hover:text-green-500" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-5 text-center">There is no items in cart!</div>
          )}
        </div>
        {cartItems.length > 0 ? (
          cartItems.map((item, i): any => (
            <div
              key={i}
              className="border-b py-2 px-3 flex items-stretch gap-5 justify-between"
            >
              <div className="border p-5 center rounded-md">
                <Image
                  src="/images/product.jpg"
                  alt="Product Image"
                  height={100}
                  width={80}
                  className=""
                />
              </div>
              <div className="flex-1">
                <p className="font-bold pt-2">{item.name}</p>
                <p>Ratings: {item.rating}</p>
              </div>
              <div className="w-[70px] self-center">${item.price}</div>
              <div className="w-[70px] self-center">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  defaultValue={item.quantity}
                  className="border w-16 p-2"
                  onChange={(e) =>
                    handleQuantityChange(item.id, e.target.value)
                  }
                />
              </div>
              <div className="w-[70px] self-center">
                ${item.price * parseInt(item.quantity)}
              </div>
              <div className="w-[70px] self-center">
                <button onClick={() => handleDelete(item.id)}>
                  <Trash className="hover:text-green-500" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-5 text-center">There is no items in cart!</div>
        )}
      </div>
      <div className="lg:col-span-2 h-fit">
        <div className="bg-white w-full rounded-md border p-5">
          <p className="border-b py-2 flex justify-between gap-1 items-center">
            <span className="font-semibold">Subtotal:</span>
            <span className="text-xl font-bold text-green-500">
              ${subtotalValue}
            </span>
          </p>
          <p className="border-b py-2 flex justify-between gap-1 items-center">
            <span className="font-semibold">Delivery Charge:</span>
            <span className="text-xl font-bold text-green-500">
              {delivery > 0 ? delivery : "Free"}
            </span>
          </p>
          <p className="mb-5 py-2 flex justify-between gap-1 items-center">
            <span className="font-semibold">Total:</span>
            <span className="text-xl font-bold text-green-500">${total}</span>
          </p>
          <Link href={`/billing-info`}>
            <button
              className="bg-green-500 hover:bg-green-600 rounded-md text-white w-full font-medium p-2 center gap-2 disabled:bg-green-200"
              disabled={subtotal > 0 ? false : true}
            >
              Proceed to checkout <Banknote />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartView;
