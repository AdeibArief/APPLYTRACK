import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await api.put(`/api/auth/resetpassword/${token}`, { password });
      navigate("/dashboard");
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
            Reset Password
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          {error && <p className="text-error text-sm text-center">{error}</p>}
          <input
            type="password"
            placeholder="New Password"
            className="input input-bordered w-full text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full text-center"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="btn btn-primary w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;