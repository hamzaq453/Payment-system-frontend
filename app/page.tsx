"use client";

import React, { useState } from "react";

export default function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    document: null as File | null,
    picture: null as File | null,
    is_registered: false,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "document" | "picture"
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [key]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = new FormData();
    payload.append("first_name", formData.first_name);
    payload.append("last_name", formData.last_name);
    payload.append("email", formData.email);
    payload.append("address", formData.address);
    if (formData.document) payload.append("document", formData.document);
    if (formData.picture) payload.append("picture", formData.picture);
    payload.append("is_registered", String(formData.is_registered));

    try {
      const response = await fetch("http://localhost:8002/users/", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to create user");
      }

      const result = await response.json();
      setSuccessMessage("User registered successfully!");
      console.log("New user:", result);
      window.location.href = "/payment";
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center px-4">
      <div className="bg-white max-w-2xl w-full shadow-lg rounded-lg p-8 mt-4 mb-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to <span className="text-indigo-600">MicroPedro Remittance</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="mt-1 text-gray-700 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="mt-1 text-gray-700 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 text-gray-700 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="mt-1 text-gray-700 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="document"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Document
            </label>
            <input
              type="file"
              id="document"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e, "document")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="picture"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Picture
            </label>
            <input
              type="file"
              id="picture"
              accept="image/png, image/jpeg"
              onChange={(e) => handleFileChange(e, "picture")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-center ">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600  text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </form>

        {successMessage && (
          <p className="mt-4 text-green-600 text-center">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="mt-4 text-red-600 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
