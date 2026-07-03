import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaClock, FaUser } from "react-icons/fa";

const ExamPage = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const examId = localStorage.getItem("examId");
  const userName = localStorage.getItem("userName");

  const rawEndTime = localStorage.getItem("examEndTime");
  const examEndTime = rawEndTime
    ? new Date(rawEndTime).getTime()
    : Date.now() + 60 * 60 * 1000;

  const [activeAudio, setActiveAudio] = useState({
    questionId: null,
    optionIndex: null,
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingQuestionId, setSpeakingQuestionId] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(examEndTime - Date.now());
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  /* ---------------- AUDIO STOP ---------------- */
  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setActiveAudio({ questionId: null, optionIndex: null });
    setIsSpeaking(false);
    setSpeakingQuestionId(null);
  };

  /* ---------------- AUDIO TOGGLE ---------------- */
  const toggleSpeak = async (questionObj) => {
    // same question already speaking → stop
    if (isSpeaking && speakingQuestionId === questionObj.id) {
      stopAudio();
      return;
    }

    if (!window.speechSynthesis) {
      alert("Audio supported nahi hai");
      return;
    }

    // stop any previous audio
    window.speechSynthesis.cancel();

    setIsSpeaking(true);
    setSpeakingQuestionId(questionObj.id);

    const speak = (text, optionIndex = null) => {
      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;

        if (optionIndex !== null) {
          setActiveAudio({
            questionId: questionObj.id,
            optionIndex,
          });
        } else {
          setActiveAudio({
            questionId: questionObj.id,
            optionIndex: null,
          });
        }

        utterance.onend = resolve;
        window.speechSynthesis.speak(utterance);
      });
    };

    try {
      // Speak question
      await speak(`प्रश्न है: ${questionObj.question}`);

      // Speak options
      for (let i = 0; i < questionObj.options.length; i++) {
        await speak(`विकल्प ${i + 1}: ${questionObj.options[i]}`, i);
      }
    } finally {
      // Auto OFF
      setActiveAudio({ questionId: null, optionIndex: null });
      setIsSpeaking(false);
      setSpeakingQuestionId(null);
    }
  };

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = examEndTime - Date.now();
      setTimeLeft(diff);

      if (diff <= 0) {
        clearInterval(timer);
        autoSubmitExam();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [examEndTime]);

  /* ---------------- FETCH QUESTIONS ---------------- */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          "https://digital-sakhi-backend-4-rapv.onrender.com/api/exam/questions"
        );
        setQuestions(res.data.questions);
      } catch (err) {
        alert("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  /* ---------------- HANDLE ANSWER ---------------- */
  const handleOptionSelect = (questionId, optionIndex) => {
    setAnswers((prev) => {
      const exists = prev.find((a) => a.questionId === questionId);

      if (exists) {
        return prev.map((a) =>
          a.questionId === questionId
            ? { ...a, selectedOption: optionIndex }
            : a
        );
      }

      return [...prev, { questionId, selectedOption: optionIndex }];
    });
  };

  /* ---------------- SUBMIT EXAM ---------------- */
  const submitExam = async () => {
    if (submitted) return;

    if (answers.length === 0) {
      alert("कम से कम एक प्रश्न का उत्तर देना अनिवार्य है");
      return;
    }

    setSubmitted(true);

    try {
      const res = await axios.post(
        "https://digital-sakhi-backend-4-rapv.onrender.com//api/exam/submit",
        {
          userId,
          examId,
          answers,
        }
      );

      const submitId = res.data.submitId;
      navigate(`/result/${submitId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Exam submission failed");
      setSubmitted(false);
    }
  };

  const autoSubmitExam = () => {
    if (!submitted) submitExam();
  };

  /* ---------------- TIME FORMAT ---------------- */
  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  if (loading) {
    return <div className="mt-20 text-center">Loading Exam...</div>;
  }

  return (
    <div className="min-h-screen pt-20 p-4 bg-gray-100">
      {/* -------- TOP BAR -------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 bg-white shadow rounded-xl">
        <div className="flex items-center gap-3">
          <FaUser className="text-blue-600" />
          <div>
            <p className="font-semibold">{userName}</p>
            <p className="text-xs text-gray-500">User ID: {userId}</p>
            <p className="text-xs text-gray-500">Exam ID: {examId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50">
          <FaClock className="text-blue-600" />
          <span className="font-semibold text-blue-700">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* -------- ALL QUESTIONS -------- */}
      <div className="max-w-4xl mx-auto space-y-6">
        {questions.map((q, index) => (
          <div key={q.id} className="p-6 bg-white shadow rounded-xl">
            <button
              onClick={() => toggleSpeak(q)}
              className={`mb-4 flex items-center gap-2 px-3 py-1 text-sm rounded-lg text-white ${
                isSpeaking && speakingQuestionId === q.id
                  ? "bg-red-600"
                  : "bg-blue-600"
              }`}
            >
              {isSpeaking && speakingQuestionId === q.id
                ? "⏹ बंद करें"
                : "🔊 सुनें"}
            </button>

            <h2 className="mb-4 font-semibold">
              Q{index + 1}. {q.question}
            </h2>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const selected =
                  answers.find((a) => a.questionId === q.id)
                    ?.selectedOption === idx;

                const isActiveAudio =
                  activeAudio.questionId === q.id &&
                  activeAudio.optionIndex === idx;

                return (
                  <label
                    key={idx}
                    className={`block p-3 border rounded-lg cursor-pointer transition-all ${
                      isActiveAudio
                        ? "bg-yellow-100 border-yellow-500 scale-105"
                        : selected
                        ? "bg-blue-100 border-blue-500"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      className="hidden"
                      checked={selected}
                      onChange={() => handleOptionSelect(q.id, idx)}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* -------- SUBMIT BUTTON -------- */}
        <div className="py-6 text-center">
          <button
            onClick={submitExam}
            disabled={submitted}
            className="px-10 py-3 font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
