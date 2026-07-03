import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaUser
} from "react-icons/fa";

const ExamInstructions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  const startExam = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "https://digital-sakhi-backend-4-rapv.onrender.com/api/exam/start",
        { userId }
      );

      localStorage.setItem("examId", res.data.exam._id);
      localStorage.setItem("examEndTime", res.data.exam.examEndTime);

      navigate("/exam");
    } catch (error) {
      alert(error.response?.data?.message || "Exam start failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 ">
      <div className="w-full max-w-3xl p-6 bg-white shadow-xl rounded-2xl">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-blue-700">
            Digital Sakhi Online Examination
          </h1>
          <p className="mt-1 text-gray-500">
            कृपया परीक्षा शुरू करने से पहले निर्देश ध्यान से पढ़ें
          </p>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
          <FaUser className="text-xl text-blue-600" />
          <div>
            <p className="font-semibold text-gray-800">{userName}</p>
            <p className="text-sm text-gray-600">User ID: {userId}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3 text-gray-700">
          <Instruction icon={<FaClock />} text="परीक्षा अवधि: 1 घंटा" />
          <Instruction icon={<FaCheckCircle />} text="न्यूनतम पासिंग स्कोर: 14" />
          <Instruction
            icon={<FaExclamationTriangle />}
            text="एक बार शुरू होने के बाद, परीक्षा को रोका नहीं जा सकता।"
          />
          <Instruction
            icon={<FaExclamationTriangle />}
            text="ब्राउज़र को रीफ़्रेश या बंद न करें।"
          />
          <Instruction
            icon={<FaClock />}
            text="समय समाप्त होने पर परीक्षा स्वतः सबमिट हो जाएगी।"
          />
          <Instruction
            icon={<FaCheckCircle />}
            text="एक समय में एक प्रश्न दिखाई देगा।"
          />
          <Instruction
            icon={<FaCheckCircle />}
            text="पास होने पर प्रमाण पत्र जारी किया जाएगा।"
          />
        </div>

        {/* Button */}
        <div className="mt-8 text-center">
          <button
            onClick={startExam}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            {loading ? "Exam Starting..." : "Continue to Exam"}
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

const Instruction = ({ icon, text }) => (
  <div className="flex items-start gap-3">
    <span className="mt-1 text-blue-600">{icon}</span>
    <p>{text}</p>
  </div>
);

export default ExamInstructions;
