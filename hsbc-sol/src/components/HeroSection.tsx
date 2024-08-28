"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 md:py-32 overflow-hidden relative h-[80vh]"
    >
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="smallGrid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
        <motion.div
          variants={itemVariants}
          className="text-white mb-12 md:mb-0 md:mr-8 max-w-2xl"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Unlock the Power of{" "}
            <span className="text-yellow-300">Financial Insights</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl mb-10 leading-relaxed"
          >
            Our cutting-edge Financial Dashboard empowers you to make
            data-driven decisions with confidence and ease.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              href="/dashboard"
              className="bg-white text-blue-600 py-4 px-8 rounded-full text-lg font-semibold hover:bg-yellow-300 hover:text-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Get Started Now
              <motion.span
                className="inline-block ml-2"
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="w-full md:w-auto relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute inset-0 bg-blue-300 rounded-full filter blur-3xl opacity-30 animate-pulse" />
          <svg
            width="600"
            height="400"
            viewBox="0 0 600 400"
            className="rounded-lg shadow-2xl bg-white"
          >
            <rect x="20" y="20" width="560" height="70" rx="8" fill="#E5E7EB" />
            <rect x="40" y="40" width="200" height="30" rx="4" fill="#9CA3AF" />
            <rect
              x="260"
              y="40"
              width="100"
              height="30"
              rx="4"
              fill="#9CA3AF"
            />
            <rect
              x="380"
              y="40"
              width="100"
              height="30"
              rx="4"
              fill="#9CA3AF"
            />
            <rect x="500" y="40" width="60" height="30" rx="4" fill="#4F46E5" />

            <rect
              x="20"
              y="110"
              width="270"
              height="270"
              rx="8"
              fill="#F3F4F6"
            />
            <circle cx="155" cy="245" r="100" fill="#4F46E5" />
            <path
              d="M155 145 L155 245 L230 245"
              stroke="white"
              strokeWidth="4"
            />

            <rect
              x="310"
              y="110"
              width="270"
              height="130"
              rx="8"
              fill="#F3F4F6"
            />
            <rect
              x="330"
              y="130"
              width="230"
              height="20"
              rx="4"
              fill="#9CA3AF"
            />
            <rect
              x="330"
              y="160"
              width="180"
              height="20"
              rx="4"
              fill="#9CA3AF"
            />
            <rect
              x="330"
              y="190"
              width="200"
              height="20"
              rx="4"
              fill="#9CA3AF"
            />

            <rect
              x="310"
              y="250"
              width="270"
              height="130"
              rx="8"
              fill="#F3F4F6"
            />
            <rect
              x="330"
              y="270"
              width="230"
              height="90"
              rx="4"
              fill="#4F46E5"
            />
          </svg>
          <motion.div
            className="absolute -top-4 -right-4 bg-yellow-300 text-blue-800 rounded-full px-4 py-2 font-bold text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            New Features!
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-blue-700 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      />
    </motion.section>
  );
};

export default HeroSection;
