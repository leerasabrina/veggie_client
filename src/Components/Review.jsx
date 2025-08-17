import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';

const Review = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['review'],
    queryFn: async () => {
      const res = await axios.get("https://server-side-nine-ruddy.vercel.app/reviews");
      return res.data;
    }
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    toast.error('Failed to load reviews');
    return (
      <div className="text-center text-red-500 mt-10">
        <p>Something went wrong while fetching reviews.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 ">
      <h2 className="text-3xl font-bold text-center mb-6 ">User Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((review, index) => (
          <div key={index} className="card shadow-md bg-base-100 border border-gray-200">
            <div className="card-body">
              <p className="text-gray-700">💬 <span className="italic">{review.comment}</span></p>
              <div className="text-sm text-gray-500">
                <p>📧 <span className="font-medium">{review.email}</span></p>
                <p>👤 <span className="font-semibold">{review.name}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;