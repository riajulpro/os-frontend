"use client";
import React, { useState } from "react";
import ProductCard from "@/components/Product/ProductCard";
import Image from "next/image";
import PriceRangeSlider from "@/components/Product/PriceRangeSlider";
import { IBrand } from "@/types/brand";
import { IProduct } from "@/types/product";
// import { brandsData } from "@/mock/brandData";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetAllBrandsQuery } from "@/redux/features/brand/brand.api";
import Loading from "@/app/loading";

const ProductsView: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOption, setSortOption] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<number>(5);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [visibleBrands, setVisibleBrands] = useState<number>(5);
  const productsPerPage = 8;
  const minPrice = 0;
  const maxPrice = 10000;
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  const {data:productCategories} = useGetAllCategoriesQuery(undefined)
  const {data:productBrands} = useGetAllBrandsQuery(undefined)
  const { data, isSuccess, isLoading, error } = useGetAllProductsQuery({
    page: currentPage,
    limit: productsPerPage,
    sort: sortOption,
    category: selectedCategory,
    brand: selectedBrand,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
  });

  

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setCurrentPage(1);
  };

  const handleBrandChange = (brandValue: string) => {
    setSelectedBrand(brandValue);
    setCurrentPage(1);
  };

  const handleShowMoreBrands = () => {
    setVisibleBrands((prevCount) => prevCount + 5);
  };

  const handleShowLessBrands = () => {
    setVisibleBrands(5);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const ResetFilter = () => {
    setSelectedCategory(null)
    setPriceRange([0, 10000])
    setSelectedBrand(null)
  };

  const filteredProducts = data?.data || [];
  const totalPages = data?.total ? Math.ceil(data?.total / productsPerPage) : 0;

  if (isLoading) return <div className="w-full center h-[500px] md:h-[800px]">
  <Loading />
</div>;

  if (error) {
    return <h1 className="">An error occurred</h1>;
  }

  return (
    <div className="flex flex-col-reverse md:flex-row py-5 px-[80px]">
      <div className="mb-5 md:mb-0 md:mr-5 w-full md:w-1/4">
        <h2 className="text-xl font-bold mb-3">Filter Options</h2>
        <button onClick={()=> ResetFilter()} className="py-[8px] px-[20px] border text-center  rounded-md mb-[10px] bg-borderColor/50 hover:bg-borderColor capitalize font-semibold">
          clear Filter
        </button>
        <div className="space-y-3">
          <div className="p-3 rounded shadow-md">
            <h3 className="font-semibold mb-2">Categories</h3>
            <ul>
              {productCategories && productCategories?.data.slice(0, visibleCategories).map((category:any) => (
                <li key={category._id}>
                  <button
                    onClick={() => handleCategoryChange(category._id.toString())}
                    className={`w-full text-left p-2 rounded flex items-center hover:shadow-lg ${
                      selectedCategory === category._id.toString()
                        ? "bg-primaryMat text-white"
                        : "text-black"
                    }`}
                  >
                    <Image
                      src={category.image}
                      height={55}
                      width={55}
                      alt="img"
                      className=""
                    />
                    <div className="flex items-center justify-between w-full ">
                      <p className="font-medium">{category.label}</p>
                      {/* <p className="font-medium bg-primaryMat px-[10px] py-[5px] text-[12px] rounded-2xl text-white">
                        {category.count}40
                      </p> */}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {(visibleCategories < productCategories?.data.length) ? (
              <button
                onClick={() =>
                  setVisibleCategories((prevCount) => prevCount + 5)
                }
                className={` w-full text-left p-2 rounded flex items-center justify-center bg-gray-200 text-black mt-3 ${visibleCategories < 6 && "hidden"} `}
              >
                Show More
              </button>
            ) : (
              <button
                onClick={() => setVisibleCategories(5)}
                className={` w-full text-left p-2 rounded flex items-center justify-center bg-gray-200 text-black mt-3 ${visibleCategories < 6 && "hidden"} `}
              >
                Show Less
              </button>
            )}
          </div>
          <div className="p-3 rounded shadow-md">
            <PriceRangeSlider
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>
          <div className="p-3 rounded shadow-md">
            <h3 className="font-semibold mb-2">Brands</h3>
            <ul>
              {productBrands?.data.slice(0, visibleBrands).map((brand: IBrand) => (
                <li key={brand._id}>
                  <button
                    onClick={() => handleBrandChange(brand._id)}
                    className={`w-full text-left p-2 rounded flex items-center hover:shadow-lg ${
                      selectedBrand === brand._id
                        ? "bg-primaryMat text-white"
                        : "text-black"
                    }`}
                  >
                    <Image
                      src={brand.image}
                      height={55}
                      width={55}
                      alt="img"
                      className=""
                    />
                    <div className="flex items-center justify-between w-full ">
                      <p className="font-medium">{brand.label}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {visibleBrands < productBrands?.data.length ? (
              <button
                onClick={handleShowMoreBrands}
                className={` w-full text-left p-2 rounded flex items-center justify-center bg-gray-200 text-black mt-3 ${visibleBrands < 6 && "hidden"} `}
              >
                Show More
              </button>
            ) : (
              <button
                onClick={handleShowLessBrands}
                className={` w-full text-left p-2 rounded flex items-center justify-center bg-gray-200 text-black mt-3 ${visibleBrands < 6 && "hidden"} `}
              >
                Show Less
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="w-full md:w-3/4">
        <h2 className="text-xl font-bold mb-3">Products</h2>
        <div className="flex justify-between items-center mb-5">
          <div>
            <span className="text-gray-600">
              {data?.total} products found
            </span>
          </div>
          <div>
            <label htmlFor="sort" className="mr-2">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="border p-2 rounded"
            >
              <option value="">Select</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[50vh]">
          {filteredProducts.map((product: any, i: number) => (
            <ProductCard product={product} key={i + "product"} />
          ))}
        </div>
        <div className="flex justify-center gap-[20px] mt-20 mb-10">
          <button
            onClick={handlePrevPage}
            className="px-4 py-2 bg-primaryMat text-white rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-primaryMat text-white"
                    : "bg-borderColor text-black"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-primaryMat text-white rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsView;
