"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

// Validation schema with Yup
const schema = yup.object().shape({
  name: yup.string().required('School name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  contact: yup
    .string()
    .matches(/^\d+$/, 'Contact must be a number')
    .required('Contact is required'),
  email_id: yup.string().email('Invalid email').required('Email is required'),
  imageFile: yup
    .mixed()
    .required('Image is required')
    .test('fileSize', 'Image size is too large', (value) => {
      return value && value[0] && value[0].size <= 5 * 1024 * 1024; // max 5MB
    }),
});

export default function AddSchool() {
  const [submitMessage, setSubmitMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setSubmitMessage('');
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

      await axios.post('/api/addSchool', payload);

      setSubmitMessage('School added successfully!');
      reset();
    } catch (error) {
      console.error(error);
      setSubmitMessage('Error submitting form.');
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">
        Add School
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* School Name */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold" htmlFor="name">
            School Name
          </label>
          <input
            id="name"
            {...register('name')}
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
              errors.name ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
            } dark:bg-gray-700 dark:text-white dark:border-gray-600`}
          />
          <p className="mt-1 text-red-600 text-sm">{errors.name?.message}</p>
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            {...register('address')}
            rows={3}
            className={`w-full border rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 ${
              errors.address ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
            } dark:bg-gray-700 dark:text-white dark:border-gray-600`}
          />
          <p className="mt-1 text-red-600 text-sm">{errors.address?.message}</p>
        </div>

        {/* City */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold" htmlFor="city">
            City
          </label>
          <input
            id="city"
            {...register('city')}
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
              errors.city ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
            } dark:bg-gray-700 dark:text-white dark:border-gray-600`}
          />
          <p className="mt-1 text-red-600 text-sm">{errors.city?.message}</p>
        </div>

        {/* State */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold" htmlFor="state">
            State
          </label>
          <input
            id="state"
            {...register('state')}
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
              errors.state ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
            } dark:bg-gray-700 dark:text-white dark:border-gray-600`}
          />
          <p className="mt-1 text-red-600 text-sm">{errors.state?.message}</p>
        </div>

        {/* Contact */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold" htmlFor="contact">
            Contact Number
          </label>
          <input
            id="contact"
            {...register('contact')}
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
              errors.contact ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
            } dark:bg-gray-700 dark:text-white dark:border-gray-600`}
          />
          <p className="mt-1 text-red-600 text-sm">{errors.contact?.message}</p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold" htmlFor="email_id">
            Email
          </label>
          <input
            id="email_id"
            type="email"
            {...register('email_id')}
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
              errors.email_id ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
            } dark:bg-gray-700 dark:text-white dark:border-gray-600`}
          />
          <p className="mt-1 text-red-600 text-sm">{errors.email_id?.message}</p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold" htmlFor="imageFile">
            School Image
          </label>
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            {...register('imageFile')}
            className={`w-full text-gray-700 dark:text-gray-300`}
          />
          <p className="mt-1 text-red-600 text-sm">{errors.imageFile?.message}</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Add School'}
        </button>
      </form>

      {submitMessage && (
        <p
          className={`mt-6 text-center font-medium ${
            submitMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {submitMessage}
        </p>
      )}
    </div>
  );
}
