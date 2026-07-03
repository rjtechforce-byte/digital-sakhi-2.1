import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phone) {
      alert("कृपया मोबाइल नंबर दर्ज करें");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://digital-sakhi-backend-4-rapv.onrender.com/api/users/login",
        { phone }
      );

      console.log("liogin", res.data);
      

      // Save user info
      localStorage.setItem("userId", res.data.User._id);
      localStorage.setItem("userName", res.data.User.name);

     navigate("/instructions");
    } catch (error) {
        console.log('error', error.response);
        
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 ">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
        
        {/* Header */}
        <h1 className="mb-2 text-2xl font-bold text-center text-blue-700">
          Existing User Login
        </h1>
        <p className="mb-6 text-center text-gray-500">
          पहले से पंजीकृत उपयोगकर्ता यहाँ लॉगिन करें
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <FaPhoneAlt className="absolute text-gray-400 top-3 left-3" />
            <input
              type="tel"
              placeholder="मोबाइल नंबर"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            disabled={loading}
            className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FaSignInAlt />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Redirect */}
        <p className="mt-6 text-sm text-center text-gray-500">
          नया उपयोगकर्ता हैं?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
