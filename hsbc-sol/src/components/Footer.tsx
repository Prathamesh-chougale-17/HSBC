// app/components/Footer.tsx
"use client";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 text-white py-8"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Link href="/" className="text-white font-bold text-2xl">
            Financial Dashboard
          </Link>
        </div>
        <div className="flex space-x-6">
          <motion.a
            href="#"
            className="text-white hover:text-blue-500 transition-colors duration-300"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            <FaFacebookF />
          </motion.a>
          <motion.a
            href="#"
            className="text-white hover:text-blue-500 transition-colors duration-300"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            <FaTwitter />
          </motion.a>
          <motion.a
            href="#"
            className="text-white hover:text-blue-500 transition-colors duration-300"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            <FaLinkedinIn />
          </motion.a>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-4 text-center text-gray-400">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          &copy; 2023 Financial Dashboard. All rights reserved.
        </motion.p>
      </div>
    </motion.footer>
  );
};

export default Footer;
