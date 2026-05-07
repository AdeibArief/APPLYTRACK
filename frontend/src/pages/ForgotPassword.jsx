import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/api/auth/forgotpassword", { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="card bg-base-200 card-bordered w-fit p-10">
        <div className="card-body">
          <h1 className="card-title font-bold text-3xl items-center justify-center">
            Forgot Password
          </h1>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-success text-center">
              Check your email for the reset link!
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {error && <p className="text-error text-sm text-center">{error}</p>}
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full text-center"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="btn btn-primary w-full"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Send Reset Link"
              )}
            </button>
            <p
              className="text-center text-sm cursor-pointer text-primary"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;