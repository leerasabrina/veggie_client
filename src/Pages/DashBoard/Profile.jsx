import React, { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../../Loader/Loader";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile", email],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://server-side-nine-ruddy.vercel.app/users/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!email,
  });

  if (isLoading) return <Loader />;
  if (isError)
    return <p className="text-red-500 text-center mt-10">Failed to load profile.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      

      <div className="bg-white shadow rounded-xl p-8 flex flex-col items-center gap-6">
        {/* Profile Image */}
        <img
          src={userData?.photoURL || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
        />

        {/* Profile Info */}
        <div className="w-full space-y-4 text-left">
          <ProfileField label="Name" value={userData?.displayName} />
          <ProfileField label="Email" value={userData?.email} />
          <ProfileField label="Phone" value={userData?.phone} />
          <ProfileField label="Address" value={userData?.address} />
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <p className="text-gray-900 text-lg">
    <span className="font-semibold text-gray-700">{label}:</span> {value || "-"}
  </p>
);

export default Profile;