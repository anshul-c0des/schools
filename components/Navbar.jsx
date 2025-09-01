"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import  useDarkMode  from "../hooks/useDarkMode"; // your custom hook

export default function Navbar({ showAddSchoolButton = true, showBackButton = false }) {
  const router = useRouter();
  const [ darkMode, toggleDarkMode ] = useDarkMode();

  return (
    <nav className="bg-blue-600 dark:bg-slate-800 shadow-md sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-5xl mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={() => router.push("/")}
              className="text-white hover:text-gray-200 transition text-xl"
              aria-label="Go back"
            >
              <IoIosArrowBack />
            </button>
          )}
          <h1 className="text-white font-extrabold text-xl cursor-pointer" onClick={() => router.push("/")}>
            School Finder
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-white hover:text-gray-200 transition text-xl"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <MdLightMode /> : <MdDarkMode />}
          </button>

          {/* Add School button, conditionally shown */}
          {showAddSchoolButton && (
            <button
              onClick={() => router.push("/addSchool")}
              className="flex justify-center items-center gap-1 bg-white text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-100 transition"
            >
              Add School
              <FaPlus size={14} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
