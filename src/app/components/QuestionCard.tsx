"use client";

import React from "react";
import { motion } from "framer-motion";

export type Question = {
  id: number;
  question: string;
  correct_ans: string;
  incorrect_answers: string[];
  recommend: string;
  point: number;
  shuffled_answers?: string[]; // ที่ผ่านการสลับเรียบร้อย
};

export type AnswerStatus = "correct" | "incorrect" | "";

type QuestionCardProps = {
  currentQuestion: Question;
  selectedAnswer: string | null;
  answerStatus: AnswerStatus;
  onAnswerSelect: (answer: string) => void;
};

const questionAnimation = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const answerAnimation = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  currentQuestion,
  selectedAnswer,
  answerStatus,
  onAnswerSelect,
}) => {
  return (
    <div>
      {/* แสดงคำถาม */}
      <motion.div
        variants={questionAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        className="mb-4"
      >
        <p className="text-lg font-medium">{currentQuestion.question}</p>
      </motion.div>

      {/* แสดงตัวเลือกคำตอบ */}
      <div className="flex flex-col gap-4">
        {(currentQuestion.shuffled_answers || []).map((answer, index) => (
          <motion.button
            key={index}
            variants={answerAnimation}
            initial="initial"
            animate="animate"
            onClick={() => onAnswerSelect(answer)}
            disabled={!!selectedAnswer} // ถ้ามีการเลือกแล้วจะ disabled
            className={`w-full py-2 px-4 rounded-lg border ${
              selectedAnswer === answer
                ? answerStatus === "correct"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {answer}
          </motion.button>
        ))}
      </div>

      {/* แสดงผลหลังเลือกคำตอบ */}
      {answerStatus && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <p className="text-sm font-medium">
            {answerStatus === "correct" ? "\u2714 คำตอบถูกต้อง!" : "\u2718 คำตอบผิด!"}
          </p>
          <p className="text-sm mt-2 text-gray-600">{currentQuestion.recommend}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
