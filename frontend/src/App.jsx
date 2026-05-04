import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import useAuthStore from "./store/useAuthStore";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { useEffect } from "react";

const App = () => {
  const { token, checkAuth, error, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    useAuthStore.setState({ error: null });
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={token ? <Dashboard /> : <Home />} />
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
