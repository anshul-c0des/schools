"use client"

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BarLoader, ClipLoader } from "react-spinners";
import { MdDeleteForever } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

const PAGE_SIZE = 10;

export default function ShowSchools() {
  const [schools, setSchools] = useState([]); // Stores all schools (for infinite scroll)
  const [filteredSchools, setFilteredSchools] = useState([]); // Stores filtered schools (for search)
  const [loading, setLoading] = useState(true); // Loading initial data
  const [loadingMore, setLoadingMore] = useState(false); // Loading next pages
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [page, setPage] = useState(1); // Current page for pagination
  const [hasMore, setHasMore] = useState(true); // To track if there's more data to load

  const router = useRouter();

  // Fetch schools for a specific page
  const fetchSchools = useCallback(async (pageNum) => {
    if (!hasMore && pageNum !== 1) return; // Prevent fetching if no more data

    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await axios.get(`/api/getSchools?page=${pageNum}&limit=${PAGE_SIZE}`);
      const data = res.data.slice().reverse(); // Keep the logic of newest first

      // Ensure no duplicates in the schools list
      setSchools((prev) => {
        const allSchools = [...prev, ...data];
        return allSchools.filter(
          (school, index, self) =>
            index === self.findIndex((t) => t.id === school.id) // Ensure unique by school ID
        );
      });

      // Apply search filter to the new data and update filteredSchools
      if (!searchTerm) {
        setFilteredSchools((prev) => {
          const allSchools = [...prev, ...data];
          return allSchools.filter(
            (school, index, self) =>
              index === self.findIndex((t) => t.id === school.id) // Ensure unique by school ID
          );
        });
      } else {
        setFilteredSchools((prev) => [
          ...prev,
          ...data.filter((school) =>
            [school.name, school.city, school.address]
              .join(" ")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          ),
        ]);
      }

      // If there are fewer results than PAGE_SIZE, set hasMore to false
      if (data.length < PAGE_SIZE) {
        setHasMore(false); // No more data to load
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [hasMore, searchTerm]);

  // Initial fetch and when page changes
  useEffect(() => {
    fetchSchools(page);
  }, [page, fetchSchools]);

  // Search filter logic (on schools list)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredSchools(schools); // Show all if no search term
    } else {
      const filtered = schools.filter((school) =>
        [school.name, school.city, school.address]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredSchools(filtered); // Filter based on search term
    }
  }, [searchTerm, schools]);

  // Scroll event to load more
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !loadingMore && hasMore && !loading
      ) {
        setPage((prev) => prev + 1); // Increment page to load next
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore, loading]);

  // Handle delete school
  const handleDelete = (schoolId) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
      const updatedSchools = schools.filter((school) => school.id !== schoolId);
      setSchools(updatedSchools);
      setFilteredSchools(updatedSchools); // Update the filtered list immediately

      // Make API call to delete the school
      axios
        .delete(`/api/deleteSchool/${schoolId}`)
        .then(() => {
          alert("School deleted successfully.");
        })
        .catch((err) => {
          // In case of error, revert UI update
          setSchools(schools);
          setFilteredSchools(schools);
          console.error("Error deleting school:", err);
          alert("There was an error deleting the school. Please try again.");
        });
    }
  };

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
            className="flex justify-center items-center gap-1 bg-white text-blue-600 font-semibold px-4 py-2 rounded-md hover:bg-blue-100 transition"
          >
            Add School
            <FaPlus size={14} />
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
              className="bg-white relative rounded-lg group shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition duration-300 ease-in-out"
              title={`${school.name} - ${school.city}`}
            >
              <img
                src={school.image}
                alt={school.name}
                className="w-full h-48 object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{school.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{school.address}</p>
                <p className="text-sm font-medium text-blue-600 ">{school.city}</p>
              </div>
              <div className="absolute bottom-4 right-2">
                <button
                  onClick={() => handleDelete(school.id)}
                  className="text-gray-600 hover:text-red-600"
                >
                  <MdDeleteForever size={25} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loading more spinner */}
        {loadingMore && (
          <div className="flex justify-center mt-8">
            <ClipLoader color="#6366f1" />
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
