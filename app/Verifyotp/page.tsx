"use client";

import { useState } from "react";
import axios from "axios";

const OTPVerificationPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [showResendModal, setShowResendModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleVerifyOtp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const verifyResponse = await axios.post("http://localhost:8003/verify-otp/", { email, otp });

      if (verifyResponse.data) {
        const checkoutResponse = await axios.post("http://localhost:8003/create-checkout-session/", { email, otp });
        const { checkout_url } = checkoutResponse.data;

        if (checkout_url) {
          setCheckoutUrl(checkout_url);
          window.location.href = checkout_url;
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    } catch {
      setError("Invalid OTP or payment record not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");

    const resendOtpUrl = `http://localhost:8003/resend-otp/?first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}`;

    try {
      await axios.post(resendOtpUrl, {
        first_name: firstName,
        last_name: lastName,
      });

      setToastMessage("OTP sent successfully!");
      setShowResendModal(false);
    } catch {
      setError("Failed to resend OTP. Please check the provided details.");
    } finally {
      setResendLoading(false);
    }
  };

  const closeToast = () => {
    setToastMessage("");
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center px-4">
      <div className="bg-white max-w-2xl w-full shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          OTP <span className="text-indigo-600">Verification</span>
        </h1>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md transition-all ${
              loading
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {loading && <p className="text-gray-500 mt-4">Verifying OTP, please wait...</p>}
        {error && (
          <div>
            <p className="mt-4 text-red-600">{error}</p>
            <button
              onClick={() => setShowResendModal(true)}
              className="mt-2 bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Resend OTP
            </button>
          </div>
        )}

        {showResendModal && (
          <div className="bg-white p-6 rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Resend OTP</h2>
            <input
              type="text"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
            />
            <input
              type="text"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
            />
            <div className="flex space-x-4">
              <button
                onClick={handleResendOtp}
                className={`bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md transition-all ${
                  resendLoading
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
                disabled={resendLoading}
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </button>
              <button
                onClick={() => setShowResendModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="bg-green-500 text-white p-4 rounded-md fixed top-4 right-4 shadow-lg">
            <p>{toastMessage}</p>
            <button onClick={closeToast} className="text-white underline mt-2">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPVerificationPage;
