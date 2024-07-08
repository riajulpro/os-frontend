"use client";
import React, { useState } from "react";
import {
  useGetAllSellsQuery,
  useUpdateSellStatusMutation,
} from "@/redux/features/sell/sell.api";
import Loading from "@/app/loading";

const Sell: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const salesPerPage = 5;

  const { data, isSuccess, isLoading, error } = useGetAllSellsQuery({
    page: currentPage,
    limit: salesPerPage,
  });

  const [updateSellStatus] = useUpdateSellStatusMutation();

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleStatusChange = (id: string, status: string) => {
    updateSellStatus({ id, status });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <h1>An error occurred</h1>;
  }

  const totalPages = data ? Math.ceil(data.total / salesPerPage) : 0;

  if (isSuccess) {
    return (
      <div className="p-5">
        <h2 className="text-xl font-bold mb-3">Orders</h2>
        <div className="min-h-[300px]">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Product Name</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Cost</th>
                <th className="py-2 px-4 border-b">Customer Name</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.length > 0 ? (
                data?.data.map((sell: any) => (
                  <tr key={sell._id} className="group">
                    <td className="py-2 px-4 border-b">{sell._id}</td>
                    <td className="py-2 px-4 border-b">
                      {sell.sellData.map((item: any) => (
                        <div className="line-clamp-1" key={item.productId._id}>
                          {item.productId?.name}
                        </div>
                      ))}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(sell.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {sell.sellData.map((item: any) => (
                        <div key={item.productId._id}>{item.quantity}</div>
                      ))}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {sell.sellData.map((item: any) => (
                        <div className="py-[5px]" key={item.productId._id}>
                          {item.quantity * item.productId.discountPrice}$
                        </div>
                      ))}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {sell.customer?.firstName}
                    </td>
                    <td className="py-2 px-4 border-b relative">
                      {sell.status}
                      {sell.status === "Pending" && (
                        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-100 flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleStatusChange(sell._id, "Cancelled")}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleStatusChange(sell._id, "Delivered")}
                            className="px-3 py-1 bg-green-500 text-white rounded"
                          >
                            Confirm
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center w-full text-borderDark text-xl pt-[40px]">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {data?.data.length} of {data?.total || 0} sales
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              className={`px-4 py-2 text-white rounded ${
                currentPage > 1 ? "bg-primaryMat" : "cursor-not-allowed bg-gray-200"
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className={`px-4 py-2 text-white rounded ${
                currentPage < totalPages ? "bg-primaryMat" : "cursor-not-allowed bg-gray-200"
              }`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Sell;
