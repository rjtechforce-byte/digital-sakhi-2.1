import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
     block: "",  
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "https://digital-sakhi-backend-4-rapv.onrender.com/api/users",
        formData
      );

      // save user info
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("userName", res.data.user.name);

      navigate("/instructions");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 ">
      <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-2xl">
        <h1 className="mb-2 text-2xl font-bold text-center text-pink-600">
          Digital Sakhi Exam Registration
        </h1>
        <p className="mb-6 text-center text-gray-500">
          प्रमाण पत्र प्राप्त करने के लिए पंजीकरण करें
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute text-gray-400 top-3 left-3" />
            <input
              type="text"
              name="name"
              required
              placeholder="पूरा नाम"
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <FaPhone className="absolute text-gray-400 top-3 left-3" />
            <input
              type="tel"
              name="phone"
              required
              placeholder="मोबाइल नंबर"
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute text-gray-400 top-3 left-3" />
            <input
              type="email"
              name="email"
              required
              placeholder="ईमेल"
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              onChange={handleChange}
            />
          </div>

            {/* Block / Tehsil Dropdown */}
<div className="relative group">
  <FaMapMarkerAlt className="absolute text-gray-400 top-3 left-3 group-focus-within:text-pink-500 transition" />

  <select
    name="block"
    required
    value={formData.block}
    onChange={handleChange}
    className="w-full p-2 pl-10 pr-10 border rounded-lg appearance-none bg-white 
    focus:outline-none focus:ring-2 focus:ring-pink-400 
    shadow-sm hover:shadow-md transition-all duration-300"
  >
    <option value="">अपना ब्लॉक / तहसील चुनें</option>

    <option value="Churu">Churu</option>
    <option value="Ratangarh">Ratangarh</option>
    <option value="Sardarshahar">Sardarshahar</option>
    <option value="Sujangarh">Sujangarh</option>
    <option value="Taranagar">Taranagar</option>
    <option value="Rajgarh">Rajgarh</option>
    <option value="Bidasar">Bidasar</option>
  </select>

  {/* Custom Arrow */}
  <div className="absolute text-gray-500 right-3 top-3 pointer-events-none group-focus-within:text-pink-500 transition">
    ▼
  </div>
</div>

          {/* Address */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute text-gray-400 top-3 left-3" />
            <textarea
              name="address"
              required
              placeholder="पूरा पता"
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              onChange={handleChange}
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-2 font-semibold text-white transition bg-pink-600 rounded-lg hover:bg-pink-700"
          >
            {loading ? "Registering..." : "Register & Continue"}
          </button>
        </form>
        
        <div className="p-4 mt-6 text-center border border-blue-200 rounded-lg bg-blue-50">
  <p className="mb-2 text-sm text-gray-700">
    <span className="font-semibold">नोट:</span> यदि आप पहले से पंजीकृत हैं या
    पहले परीक्षा दे चुके हैं, तो कृपया नया रजिस्ट्रेशन न करें।
  </p>

  <p className="mb-3 text-sm text-gray-700">
    पहले से मौजूद उपयोगकर्ता यहाँ से लॉगिन करें।
  </p>

  <button
    type="button"
    onClick={() => navigate("/login")}
    className="px-5 py-2 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
  >
    Login Here
  </button>
</div>



      </div>
    </div>
  );
};

export default UserRegister;
