"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">HSBC</Link>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex space-x-6"
        >
          <Link
            href="/"
            className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
          >
            Dashboard
          </Link>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </motion.div>
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-600 hover:text-blue-500 transition-colors duration-300"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg py-4 px-4"
        >
          <Link href="/" passHref>
            Home
          </Link>
          <Link
            href="/dashboard"
            className="block text-gray-600 hover:text-blue-500 transition-colors duration-300 mb-2"
          >
            Dashboard
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
