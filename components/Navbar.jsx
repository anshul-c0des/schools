"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import useDarkMode from "../hooks/useDarkMode";

export default function Navbar({ showAddSchoolButton = true, showBackButton = false }) {
  const router = useRouter();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 dark:bg-slate-900 shadow-md sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-5xl mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={() => router.push("/")}
              className="text-white hover:bg-gray-200 dark:bg-blue-600 hover:dark:bg-blue-700 bg-white rounded-full p-1 hover:text-gray-200 transition text-xl"
              aria-label="Go back transition"
            >
              <IoIosArrowBack className="text-blue-500 pr-1 dark:text-white transition" size={30} />
            </button>
          )}
          <h1
            className="text-xl sm:text-2xl md:text-3xl mb-1 font-extrabold cursor-pointer text-white dark:text-blue-500"
            onClick={() => router.push("/")}
          >
            School Finder
          </h1>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-white hover:text-gray-200 transition text-xl"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <MdLightMode size={25} /> : <MdDarkMode size={25} />}
          </button>

          {/* Add School button */}
          {showAddSchoolButton && (
            <button
              onClick={() => router.push("/addSchool")}
              className="flex dark:text-white dark:bg-indigo-500 hover:dark:bg-indigo-600 justify-center items-center gap-1 bg-white text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-100 transition"
            >
              Add School
              <FaPlus size={14} />
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white hover:text-gray-200 transition text-2xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-blue-700 dark:bg-slate-900 p-4 space-y-4 max-w-5xl mx-auto bg:">
          {/* Dark mode toggle */}
          <button
            onClick={() => {
              toggleDarkMode();
              setMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 text-white hover:text-gray-200 transition text-xl "
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <MdLightMode size={25} /> : <MdDarkMode size={25} />}
            {/* <span className="text-sm">{darkMode ? "Light Mode" : "Dark Mode"}</span> */}
          </button>

          {/* Add School button */}
          {showAddSchoolButton && (
            <button
              onClick={() => {
                router.push("/addSchool");
                setMenuOpen(false);
              }}
              className="w-full flex justify-center items-center gap-2 dark:text-white dark:bg-indigo-500 hover:dark:bg-indigo-600 bg-white text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-100 transition"
            >
              Add School
              <FaPlus size={14} />
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
