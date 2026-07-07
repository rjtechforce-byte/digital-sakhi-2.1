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

  // 🔹 download related states
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

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

      if (res.data?.certificateUrl) {
        setCertificate(res.data);
      }
    } catch (err) {
      console.warn("Certificate already exists or not generated yet");
    } finally {
      setGenerating(false);
    }
  };

  /* -------- DOWNLOAD CERTIFICATE -------- */
  const downloadCertificate = async () => {
    // 🛡 safety guard
    if (!certificate || !certificate.certificateUrl) {
      alert("Certificate abhi ready nahi hai. Thoda wait karein.");
      return;
    }

    try {
      setDownloading(true);
      setSuccess(false);

      const response = await fetch(certificate.certificateUrl);
      const blob = await response.blob();

      const tempUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = tempUrl;
      link.download = "Digital_Sakhi_Certificate.png";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(tempUrl);

      setSuccess(true);
    } catch (error) {
      alert("Certificate download failed 😔");
    } finally {
      setDownloading(false);
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

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Result not available.
      </div>
    );
  }

  const isPass = result.result === "pass";

  return (
    <div className="flex items-center justify-center min-h-screen p-4 mt-10">
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

        {/* GENERATING MESSAGE */}
        {isPass && generating && (
          <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg font-medium animate-pulse">
            ⏳ कृपया पेज रीलोड न करें।  
            आपका सर्टिफिकेट तैयार किया जा रहा है...
          </div>
        )}

        {/* CERTIFICATE SECTION */}
        {isPass && certificate && (
          <div className="mt-8">
            <h2 className="flex items-center justify-center gap-2 text-xl font-semibold text-blue-700">
              <FaCertificate /> Certificate
            </h2>

         
            <button
              onClick={downloadCertificate}
              disabled={downloading}
              className={`inline-flex items-center gap-2 px-6 py-2 mt-4 text-white rounded-lg
                ${
                  downloading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              <FaDownload />
              {downloading ? "Downloading..." : "Download Certificate"}
            </button>

            {success && (
              <div className="mt-4 p-3 text-green-700 bg-green-100 rounded-lg font-medium">
                ✅ Certificate saved successfully 🎉
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
