import React, { useContext, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate } from "react-router";

const All = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState(""); // "high" or "low"
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [page, setPage] = useState(1);
  const limit = 8;

  const { data = {}, isLoading } = useQuery({
    queryKey: ["all-products", startDate, endDate, sort, page],
    queryFn: async () => {
      const res = await axios.get(
        "https://server-side-nine-ruddy.vercel.app/public/all-products",
        {
          params: { startDate, endDate, sort, page, limit },
        }
      );
      return res.data;
    },
  });

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const products = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Discover Fresh Market Veggies</h2>

      {/* Filter and Sort Form */}
      <form
        onSubmit={handleFilter}
        className="flex flex-wrap gap-4 items-end mb-6"
      >
        {/* তারিখ ফিল্টার থাকলে এখানে ইনপুট দিবে */}
        {/* Sort Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSort("high");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg border ${
              sort === "high"
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Price High → Low
          </button>
          <button
            type="button"
            onClick={() => {
              setSort("low");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg border ${
              sort === "low"
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Price Low → High
          </button>
        </div>
      </form>

      {/* Products Card Grid */}
      {isLoading ? (
        <Loader />
      ) : products.length === 0 ? (
        toast.error("No product found")
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className=" rounded-lg shadow-2xl p-4 bg-white hover:shadow-lg transition"
              >
                <img
                  src={product.image}
                  alt={product.itemName}
                  className="w-full h-40 object-cover rounded mb-4"
                />

                <h3 className="text-lg font-semibold">{product.itemName}</h3>
                <p className="text-green-700 font-bold">
                  ${product.pricePerUnit}
                </p>
                <p className="text-sm text-gray-600">📅 {product.date}</p>
                <p className="text-sm text-gray-700">🛒 {product.marketName}</p>
                <p className="text-sm text-gray-700">👤 {product.vendorName}</p>

                <button
                  onClick={() => {
                    if (user) {
                      navigate(`/market/${product._id}`);
                    } else {
                      navigate("/signin");
                    }
                  }}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white py-1.5 px-4 rounded-lg text-sm"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`px-3 py-1 border rounded ${
                  pg === page
                    ? "bg-[#007c00] text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default All;
