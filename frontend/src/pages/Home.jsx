import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const Home = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Navbar
      <nav className="w-full h-16 bg-base-200 flex justify-between items-center px-6">
        <span className="text-xl font-bold">ApplyTrack</span>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate(token ? "/dashboard" : "/login")}
        >
          {token ? "Dashboard" : "Login"}
        </button>
      </nav> */}

      {/* Hero */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6 gap-6">
        <h1 className="text-5xl font-bold">Track Every Application.</h1>
        <h2 className="text-5xl font-bold text-primary">
          Never Lose Track Again.
        </h2>
        <p className="text-base-content/50 text-lg max-w-xl">
          ApplyTrack helps you manage all your job applications in one place.
          Add jobs instantly with our Chrome extension and track your progress
          from application to offer.
        </p>

        <div className="flex gap-4 mt-4">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate(token ? "/dashboard" : "/register")}
          >
            Get Started
          </button>

          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-lg"
          >
            Add to Chrome
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 pb-16">
        <div className="card bg-base-200 p-6">
          <h3 className="text-xl font-bold mb-2">🔍 Auto Extract</h3>
          <p className="text-base-content/50">
            Our Chrome extension automatically extracts the company name, role,
            and source from any job listing page.
          </p>
        </div>
        <div className="card bg-base-200 p-6">
          <h3 className="text-xl font-bold mb-2">📊 Track Status</h3>
          <p className="text-base-content/50">
            Keep track of every application status — Applied, Interviewing,
            Offer, or Rejected — all in one dashboard.
          </p>
        </div>
        <div className="card bg-base-200 p-6">
          <h3 className="text-xl font-bold mb-2">⚡ One Click Save</h3>
          <p className="text-base-content/50">
            Save any job application with one click directly from your browser
            without switching tabs or opening new windows.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
