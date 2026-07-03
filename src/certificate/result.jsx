import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaCertificate,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

const ResultPage = () => {
  const examId = localStorage.getItem("examId");
  const userId = localStorage.getItem("userId");
  const { submitId } = useParams();

  const [result, setResult] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  /* -------- FETCH RESULT -------- */
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `https://digital-sakhi-backend-4-rapv.onrender.com/api/exam/result/${submitId}`
        );

        if (!res.data || !res.data.result) {
          throw new Error("Invalid result data");
        }

        setResult(res.data);

        // only generate if passed
        if (res.data.result === "pass") {
          generateCertificate();
        }

      } catch (err) {
        console.error("Result fetch error:", err);
        setError("परिणाम लोड नहीं हो पाया। कृपया पुनः प्रयास करें।");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [submitId]);

  /* -------- CERTIFICATE GENERATE -------- */
  const generateCertificate = async () => {
    try {
      setGenerating(true);

      const res = await axios.post(
        "https://digital-sakhi-backend-4-rapv.onrender.com/api/certificate/generate",
        { userId, examId }
      );

      // already generated OR new
      if (res.data?.certificateUrl) {
        setCertificate(res.data);
      }

    } catch (err) {
      console.warn("Certificate generate skipped / already exists");
    } finally {
      setGenerating(false);
    }
  };

  /* -------- LOADING -------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading Result...
      </div>
    );
  }

  /* -------- ERROR -------- */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  /* -------- SAFE CHECK -------- */
  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Result not available.
      </div>
    );
  }

  const isPass = result.result === "pass";

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl p-6 text-center bg-white shadow-xl rounded-2xl">

        {/* ICON */}
        {isPass ? (
          <FaCheckCircle className="mx-auto mb-4 text-6xl text-green-600" />
        ) : (
          <FaTimesCircle className="mx-auto mb-4 text-6xl text-red-600" />
        )}

        <h1
          className={`text-3xl font-bold ${
            isPass ? "text-green-700" : "text-red-700"
          }`}
        >
          {isPass ? "Congratulations! You Passed 🎉" : "Result: Failed"}
        </h1>

        <p className="mt-2 text-gray-600">
          {isPass
            ? "आपने परीक्षा सफलतापूर्वक पास कर ली है।"
            : "आप इस प्रयास में सफल नहीं हो पाए।"}
        </p>

        {/* SCORE */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-500">Score</p>
            <p className="text-xl font-bold">{result.score}</p>
          </div>
        </div>

        {/* WAITING MESSAGE */}
        {isPass && generating && (
          <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg font-medium animate-pulse">
            ⏳ कृपया पेज रीलोड न करें।  
            आपका सर्टिफिकेट तैयार किया जा रहा है...
          </div>
        )}

        {/* CERTIFICATE */}
        {isPass && certificate && (
          <div className="mt-8">
            <h2 className="flex items-center justify-center gap-2 text-xl font-semibold text-blue-700">
              <FaCertificate /> Certificate
            </h2>

            <img
              src={certificate.certificateUrl}
              alt="Certificate"
              className="w-full mt-4 border rounded-lg"
            />

            <a
              href={certificate.certificateUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="inline-flex items-center gap-2 px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <FaDownload />
              Download Certificate
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
