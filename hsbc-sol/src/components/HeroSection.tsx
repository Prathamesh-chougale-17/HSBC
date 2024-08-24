"use client";

import { motion } from "framer-motion";
import Image from "next/image";
const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-blue-500 to-purple-500 py-20 md:py-32"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-white mb-8 md:mb-0 md:mr-8">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Unlock the Power of Financial Insights
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl mb-8"
          >
            Our cutting-edge financial dashboard helps you make data-driven
            decisions with ease.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="bg-white text-blue-500 py-3 px-6 rounded-full hover:bg-gray-200 transition-colors duration-300">
              Get Started
            </button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full md:w-auto"
        >
          <Image src={"/logo.jpg"} alt="Logo" width={400} height={400} />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
