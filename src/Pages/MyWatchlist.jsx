import React, { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../Loader/Loader";

const MyWatchlist = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const { data: watchlists = [], isLoading } = useQuery({
    queryKey: ["watchlists", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `https://server-side-nine-ruddy.vercel.app/watchlist?userEmail=${user?.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
  });

  if (isLoading) return <Loader></Loader>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📌 My Watchlist
      </h2>

      {watchlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlists.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-2xl rounded-2xl p-6  hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {item.productName}
              </h3>
              <p className="text-gray-600">
                <span className="font-medium">Market:</span>{" "}
                {item.market || "—"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Date:</span>{" "}
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No items in your watchlist.</p>
      )}
    </div>
  );
};

export default MyWatchlist;
