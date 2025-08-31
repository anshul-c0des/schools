"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("School name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  contact: yup
    .string()
    .matches(/^\d+$/, "Contact must be a number")
    .required("Contact is required"),
  email_id: yup.string().email("Invalid email").required("Email is required"),
  imageFile: yup
    .mixed()
    .required("Image is required")
    .test("fileSize", "Image size is too large", (value) => {
      return value && value[0] && value[0].size <= 5 * 1024 * 1024;
    }),
});

export default function AddSchool() {
  const [submitMessage, setSubmitMessage] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = async (data) => {
    setSubmitMessage("");
    try {
      const file = data.imageFile[0];
      const base64 = await toBase64(file);

      const payload = {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        contact: data.contact,
        email_id: data.email_id,
        imageBase64: base64,
      };

      await axios.post("/api/addSchool", payload);
      setSubmitMessage("School added successfully!");
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error(error);
      setSubmitMessage("Error submitting form.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-indigo-600 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white font-semibold hover:text-indigo-200 transition"
          >
            <span className="text-2xl">{'←'}</span> School Finder
          </button>
        </div>
      </nav>
  
      {/* Form Container */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl px-8 py-10">
          <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
            Add a New School
          </h1>
  
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* your existing form inputs */}
            <FormInput label="School Name" id="name" register={register} error={errors.name} />
            <FormInput label="City" id="city" register={register} error={errors.city} />
            <FormInput label="State" id="state" register={register} error={errors.state} />
            <FormInput label="Contact Number" id="contact" register={register} error={errors.contact} />
            <FormInput label="Email" id="email_id" register={register} error={errors.email_id} type="email" />
            <FormTextarea label="Address" id="address" register={register} error={errors.address} />
  
            <div className="md:col-span-2">
              <label htmlFor="imageFile" className="block font-semibold text-gray-700 mb-1">
                Upload School Image
              </label>
              <input
                type="file"
                accept="image/*"
                id="imageFile"
                {...register("imageFile")}
                className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.imageFile && (
                <p className="text-sm text-red-600 mt-1">{errors.imageFile.message}</p>
              )}
            </div>
  
            <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-bold text-lg transition duration-200 disabled:opacity-50 flex justify-center items-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <ClipLoader color="#fff" size={20} />
                  Submitting...
                </>
              ) : (
                'Add School'
              )}
            </button>
  
              {submitMessage && (
                <p className={`mt-4 text-center text-md font-semibold ${
                  submitMessage.includes("successfully") ? "text-green-600" : "text-red-600"
                }`}>
                  {submitMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Field
function FormInput({ label, id, type = "text", register, error }) {
  return (
    <div>
      <label htmlFor={id} className="block font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        {...register(id)}
        className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"
        } bg-gray-50 text-gray-800`}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}

// Reusable Textarea Field
function FormTextarea({ label, id, register, error }) {
  return (
    <div className="md:col-span-2">
      <label htmlFor={id} className="block font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        {...register(id)}
        className={`w-full px-4 py-2 rounded-md border resize-none focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-indigo-500"
        } bg-gray-50 text-gray-800`}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}
