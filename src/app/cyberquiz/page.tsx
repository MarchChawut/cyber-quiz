"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import UserInfoForm, { UserInfo } from "../components/UserInfoForm";
import QuestionCard, { Question, AnswerStatus } from "../components/QuestionCard";
import ScoreSummary from "../components/ScoreSummary";

const CyberQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("");
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ดึงข้อมูลคำถามเมื่อ userInfo พร้อมแล้ว
  useEffect(() => {
    if (userInfo) {
      axios
        .get(`${apiBaseUrl}/question`)
        .then((response) => {
          const randomizedQuestions = response.data.map((question: Question) => {
            const answers = [...question.incorrect_answers, question.correct_ans];
            // Randomize คำตอบ
            for (let i = answers.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [answers[i], answers[j]] = [answers[j], answers[i]];
            }
            return { ...question, shuffled_answers: answers };
          });
          setQuestions(randomizedQuestions);
        })
        .catch((error) => console.error("Error fetching questions:", error));
    }
  }, [userInfo]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestionIndex].correct_ans;
    setAnswerStatus(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore((prevScore) => prevScore + 1);
  };

  const handleNextQuestion = () => {
    setAnswerStatus("");
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // อัปเดตคะแนนลงใน backend (PATCH)
  const saveScore = async () => {
    if (userInfo) {
      try {
        await axios.patch(`${apiBaseUrl}/guest-user/${userInfo.id}`, {
          score,
        });
        console.log("Score updated successfully!");
      } catch (error) {
        console.error("Error saving score:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกคะแนน กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  // แสดงผลสรุปคะแนน
  const renderScoreSummary = () => {
    // บันทึกคะแนนก่อน render
    saveScore();
    return <ScoreSummary score={score} totalQuestions={questions.length} />;
  };

  // ถ้ายังไม่มี userInfo => แสดงหน้าลงทะเบียน
  if (!userInfo) {
    return <UserInfoForm onSubmit={(info) => setUserInfo(info)} />;
  }

  // ถ้ายังโหลด questions ไม่เสร็จ
  if (questions.length === 0) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  // ถ้าทำ quiz ครบแล้ว
  if (quizFinished) {
    return renderScoreSummary();
  }

  // แสดงคำถาม
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          แบบทดสอบ Cyber Awareness
        </h1>
        <p className="text-center text-gray-700 mb-6">
          คำถาม {currentQuestionIndex + 1}/{questions.length}
        </p>

        <QuestionCard
          currentQuestion={currentQuestion}
          selectedAnswer={selectedAnswer}
          answerStatus={answerStatus}
          onAnswerSelect={handleAnswerSelect}
        />

        <div className="mt-6 text-center">
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              disabled={!answerStatus}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              ถัดไป
            </button>
          ) : (
            <button
              onClick={() => setQuizFinished(true)}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              ดูคะแนน
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CyberQuiz;
