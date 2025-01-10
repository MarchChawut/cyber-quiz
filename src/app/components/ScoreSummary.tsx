"use client";

import React from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

const scoreSummaryAnimation = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
};

type ScoreSummaryProps = {
  score: number;
  totalQuestions: number;
};

const ScoreSummary: React.FC<ScoreSummaryProps> = ({ score, totalQuestions }) => {
  let result = "";
  let emoji = "";

  if (score <= 3) {
    result = "ปรับปรุง";
    emoji = "😒";
  } else if (score <= 6) {
    result = "ปานกลาง";
    emoji = "😊";
  } else if (score <= 8) {
    result = "ดี";
    emoji = "😃";
  } else {
    result = "ดีเยี่ยม";
    emoji = "😁";
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={scoreSummaryAnimation}
        initial="initial"
        animate="animate"
        className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4"
      >
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">📝เกณฑ์การวัดคะแนน</h1>
          <p className="text-5xl mb-2 text-green-500">{result}</p>
          <p className="text-2xl font-bold">
            คุณได้คะแนน {score}/{totalQuestions}
          </p>
          <p className="text-8xl mt-4">{emoji}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScoreSummary;
