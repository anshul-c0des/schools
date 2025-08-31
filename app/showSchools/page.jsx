'use client';

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";

const PAGE_SIZE = 10;

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);         // loading initial data
  const [loadingMore, setLoadingMore] = useState(false); // loading next pages
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();

  // Fetch schools for a specific page
  const fetchSchools = useCallback(async (pageNum) => {
    if (!hasMore && pageNum !== 1) return;

    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await axios.get(`/api/getSchools?page=${pageNum}&limit=${PAGE_SIZE}`);
      const data = res.data.slice().reverse(); // keep the logic of newest first
      
      if (pageNum === 1) {
        setSchools(data);
        setFilteredSchools(data);
      } else {
        setSchools(prev => [...prev, ...data]);
        setFilteredSchools(prev => [...prev, ...data]);
      }

      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [hasMore]);

  // Initial fetch and when page changes
  useEffect(() => {
    fetchSchools(page);
  }, [page, fetchSchools]);

  // Search filter logic on loaded schools only
  useEffect(() => {
    if (!searchTerm) {
      setFilteredSchools(schools);
    } else {
      const filtered = schools.filter((school) =>
        [school.name, school.city, school.address]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredSchools(filtered);
    }
  }, [searchTerm, schools]);

  // Scroll event to load more
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !loadingMore && hasMore && !loading
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore, loading]);

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <BarLoader width={280} color="#6366f1" /> {/* Indigo-500 */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="bg-blue-600 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-white font-extrabold text-xl">School Finder</h1>
          <button
            onClick={() => router.push("/addSchool")}
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-100 transition"
          >
            Add School <span className="text-xl">{'+'}</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Find Your School</h2>

        {/* Search Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name, city or address..."
            className="w-full max-w-md mx-auto block px-4 py-3 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* No results message */}
        {!loading && filteredSchools.length === 0 && (
          <p className="text-center text-gray-600">No schools found.</p>
        )}

        {/* Schools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
              title={`${school.name} - ${school.city}`}
            >
              <img
                src={school.image}
                alt={school.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{school.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{school.address}</p>
                <p className="text-sm font-medium text-blue-600 ">{school.city}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Loading more spinner */}
        {loadingMore && (
          <div className="flex justify-center mt-8">
            <BarLoader width={280} color="#6366f1" />
          </div>
        )}

        {/* End message */}
        {!hasMore && !loadingMore && (
          <p className="text-center text-gray-600 mt-8">You've reached the end.</p>
        )}
      </main>
    </div>
  );
}
