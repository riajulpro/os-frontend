"use client";

import { addCart } from "@/redux/features/cart/cart.slice";
import { deleteWishlist } from "@/redux/features/wishlist/wishlist.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const FavoriteView = () => {
  const [quantity, setQantity] = useState<string>("");
  const { wishlist: cartItems } = useAppSelector((state) => state.wishlist);
  const dispatch = useAppDispatch();

  const addToCart = (item: any) => {
    const body = {
      id: item._id!,
      photo: item.photo,
      name: item.name,
      rating: item.rating,
      price: item.price * parseInt(quantity || item.quantity),
      quantity: quantity || item.quantity,
    };

    dispatch(addCart(body));

    toast.success("Cart added successfully!");
    console.log("You are about to add these", body);
  };

  return (
    <div className="min-h-screen">
      {" "}
      <div className="layout_container py-5 lg:py-10 grid grid-cols-1">
        <div className="border">
          <div className="px-3 font-medium py-5 bg-gray-50 flex gap-5 items-center justify-between">
            <div className="w-[121px]">Photo</div>
            <div className="flex-1">Title and Rating</div>
            <div className="w-[70px]">Price</div>
            <div className="w-[70px]">Quantity</div>
            <div className="w-[70px]">Subtotal</div>
            <div className="w-[180px] text-center">Action</div>
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
                    onChange={(e) => {
                      setQantity(e.target.value);
                    }}
                  />
                </div>
                <div className="w-[70px] self-center">
                  ${item.price * parseInt(quantity || item.quantity)}
                </div>
                <div className="w-[180px] self-center flex gap-2 items-center">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-medium p-3 rounded-md"
                    onClick={() => addToCart(item)}
                  >
                    Add to cart
                  </button>
                  <button
                    onClick={() => dispatch(deleteWishlist({ id: item.id }))}
                  >
                    <Trash className="hover:text-green-500" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-5 text-center">There is no items in cart!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteView;
