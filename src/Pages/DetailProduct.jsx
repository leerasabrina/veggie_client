import { useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import PaymentModal from "./PaymentModal";
import Watchlist from "../Components/Watchlist";
import ReviewStar from "../Components/ReviewStar";
import Chart from "../Components/Chart";
import { AuthContext } from "../Contexts/AuthContext";
import Loader from "../Loader/Loader";

const DetailProduct = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["marketDetails", id],
    queryFn: async () => {
      const res = await axios.get(`https://server-side-nine-ruddy.vercel.app/products/market/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return res.data;
    },
  });
  console.log(data)

  
  const {
    data: purchasedProducts = [],
    isLoading: loadingPurchases,
   
  } = useQuery({
    queryKey: ["purchasedProducts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`https://server-side-nine-ruddy.vercel.app
/orders?email=${user.email}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return res.data;
    },
  });

  if (isLoading || loadingPurchases) return <Loader />;
  if (isError) {
    toast.error("Cannot fetch data");
    return null;
  }

  const firstProduct = data?.[0];

  const handleBuy = (item) => {
    if (!user?.email) {
      toast.error("Please login to proceed.");
      return;
    }

    const alreadyBought = purchasedProducts.some(
      (order) => order.productId.toString() === item._id.toString()
    );

    if (alreadyBought) {
      toast.info("You have already purchased this product.");
      return;
    }

    setSelectedProduct(item);
    setModalOpen(true);
  };

  // Called after successful payment
  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries(["purchasedProducts", user.email]);
    setModalOpen(false);
    
  };

  const handleAddToCart = async (item) => {
  if (!user?.email) {
    toast.error("Please login to add to cart.");
    return;
  }

  try {
    const res = await axios.post(
      "https://server-side-nine-ruddy.vercel.app/cart",
      {
        productId: item._id,
        email: user.email,
        itemName: item.itemName,
        pricePerUnit: item.pricePerUnit,
        quantity: 1
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (res.data.insertedId) {
      toast.success(`${item.itemName} added to cart 🛒`);
    } else {
      toast.info("Already in cart");
    }
  } catch (err) {
    toast.error("Failed to add to cart");
  }
};


  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{firstProduct?.marketName}</h1>
      <p className="text-gray-600">Date: {firstProduct?.date}</p>

      <div className="w-full">
        <img
          src={firstProduct?.image}
          alt="product"
          className="w-[300px] max-h-96 object-cover rounded-xl"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mt-4">Product List & Prices</h2>
        <ul className="list-disc  mt-2 space-y-2">
          {data.map((item) => {
            const alreadyBought = purchasedProducts.some(
              (order) => order.productId.toString() === item._id.toString()
            );

            return (
              <li key={item._id} className="flex items-center gap-4">
                <span>
                  {item.itemName} — ৳{item.pricePerUnit}/kg
                </span>
                <button
                  onClick={() => handleBuy(item)}
                  disabled={alreadyBought}
                  className={`px-3 py-1 rounded ${
                    alreadyBought
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {alreadyBought ? "Already Purchased" : "🛒 Buy Product"}
                </button>
                 <button
    onClick={() => handleAddToCart(item)}
    className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
  >
    ➕ Add to Cart
  </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">👨‍🌾 Vendor Info</h2>
        <p>Name: {firstProduct?.vendorName}</p>
        <p>Email: {firstProduct?.vendorEmail}</p>
      </div>

      <div className="mt-6">
        {data.map((item) => (
          <div key={item._id}>
            <Watchlist product={item} />
          </div>
        ))}
      </div>

      {data.map((item) => (
        <div key={item._id}>
          <ReviewStar productId={item._id} />
        </div>
      ))}

      <div>
        {data.map((item) => (
          <div key={item._id}>
            <Chart product={item.itemName} />
          </div>
        ))}
      </div>

      {/* Payment Modal (show only when needed) */}
      {selectedProduct && (
        <PaymentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          product={selectedProduct}
          email={user?.email}
          onSuccess={handlePaymentSuccess} 
        />
      )}
    </div>
  );
};

export default DetailProduct;
