import { trimText } from "@/utils/trimText";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProductAddToCartBtn from "./ProductAddToCartBtn";
import ProductTooltip from "./ProductTooltip";

interface ProductCardProps {
  // product: IProduct;
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="relative w-full h-[410px]  overflow-hidden rounded-[15px] border-[1px] border-borderColor bg-white">
      {product.tag && (
        <span
          className={`bg-primaryMat text-white text-xs font-bold uppercase px-[20px] py-2 absolute top-0 left-0 rounded-br-[20px] z-20`}
        >
          {product.tag?.label}
        </span>
      )}
      <div className="w-full h-[200px] relative group/image cursor-pointer">
        <Image
          className="w-full h-full object-cover"
          src={product.photo}
          alt={product.name}
          width={350}
          height={200}
        />

        <ProductTooltip product={product} />
      </div>
      <div className="px-4 py-4">
        <div className="text-sm text-gray-500">{product.category?.label}</div>
        {/* <Link href={`/product/details/${product._id}`} className="font-bold text-xl mb-2 hover:underline"> */}
        <Link
          href={`/product/details/${product._id}`}
          className="font-bold text-xl mb-2 hover:underline"
        >
          {trimText(product.name, 20)}
        </Link>
        <div className="text-gray-700 text-base">
          By <span className="text-primaryMat">{product.brand?.label}</span>
        </div>
        <div className="mt-2 flex items-center justify-start gap-[15px]">
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-gray-700">
              {product.averageRating?.toFixed(1) || "0.0"}
            </span>
          </div>{" "}
          <div>
            <span className="text-primaryMat font-bold">
              ${product.discountPrice.toFixed(2)}
            </span>
            <span className="text-gray-500 line-through ml-2">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <ProductAddToCartBtn product={product} />
    </div>
  );
};

export default ProductCard;
