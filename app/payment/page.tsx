"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const ProcessPayment = () => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    firstName: "",
    lastName: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    const queryParams = new URLSearchParams({
      amount: formData.amount,
      description: formData.description,
      first_name: formData.firstName,
      last_name: formData.lastName,
    }).toString();

    try {
      const response = await axios.post(
        `http://localhost:8003/process-payment/?${queryParams}`
      );

      if (response.data) {
        setSuccessMessage("OTP is sent to your registered email.");
        setTimeout(() => {
          router.push("/Verifyotp");
        }, 1000);
      }
    } catch (error: any) {
      const errorDetail = parseError(error.response?.data);
      setErrorMessage(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  const parseError = (errorData: any) => {
    if (!errorData) return "An unknown error occurred. Please try again.";

    if (Array.isArray(errorData)) {
      return errorData.map((err) => JSON.stringify(err, null, 2)).join(", ");
    }

    if (typeof errorData === "object") {
      return JSON.stringify(errorData, null, 2);
    }

    return String(errorData);
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center px-4">
      <div className="bg-white max-w-2xl w-full shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Payment <span className="text-indigo-600">Processing</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="mt-1 text-gray-700 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 text-gray-700 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="mt-1 text-gray-700 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="mt-1 text-gray-700 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md transition-all ${
                loading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </form>

        {successMessage && (
          <p className="mt-4 text-green-600 text-center">{successMessage}</p>
        )}
        {errorMessage && (
          <pre className="mt-4 text-red-600 text-center">{errorMessage}</pre>
        )}
      </div>
    </div>
  );
};

export default ProcessPayment;
