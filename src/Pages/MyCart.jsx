import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../Loader/Loader";
import { AuthContext } from "../Contexts/AuthContext";
import { toast } from "react-toastify";

const MyCart = () => {
  const { user } = useContext(AuthContext);

  // fetch cart data
  const {
    data: cartItems = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cart", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `https://server-side-nine-ruddy.vercel.app/cart?email=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email, 
  });

  const handleRemove = async (id) => {
    try {
      await axios.delete(
        `https://server-side-nine-ruddy.vercel.app/cart/${id}`
      );
      toast.success("Item removed from cart");
      refetch();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.itemName}</td>
                  <td>${item.pricePerUnit}</td>
                  <td>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="btn btn-error btn-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyCart;
