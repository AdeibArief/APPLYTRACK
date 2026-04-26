import axios from "axios";
import React, { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { BACKEND_URL } from "./config";

const API_URL = BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    source: "",
    jobUrl: "",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const handleThemeToggle = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(
    () =>
      document.documentElement.setAttribute(
        "data-theme",
        localStorage.getItem("theme") || "dark",
      ),
    [],
  );
  useEffect(() => {
    chrome.storage.local.get(["token"], (result) => {
      if (result.token) {
        setToken(result.token);
      }
    });
  }, []);

  useEffect(() => {
    if (!token) return;

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0];
      setFormData((prev) => ({ ...prev, jobUrl: currentTab.url }));

      setIsLoading(true);
      try {
        const [{ result: pageText }] = await chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          func: () => document.body.innerText,
        });

        const res = await axios.post(
          `${API_URL}/api/extract`,
          { pageText, url: currentTab.url },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const { company, role, source } = res.data.data;
        setFormData((prev) => ({ ...prev, company, role, source }));
      } catch (err) {
        setError("Could not extract job info");
      } finally {
        setIsLoading(false);
      }
    });
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, loginData);
      const t = res.data.data.token;
      chrome.storage.local.set({ token: t });
      setToken(t);
    } catch (err) {
      setLoginError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/register`,
        registerData,
      );
      const t = res.data.data.token;
      chrome.storage.local.set({ token: t });
      setToken(t);
    } catch (err) {
      setLoginError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    chrome.storage.local.remove("token");
    setToken(null);
  };

  const handleSubmit = async () => {
    if (!formData.company || !formData.role || !formData.source) {
      setError("Please fill in company, role and source before saving");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/jobs/addjob`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
    } catch (err) {
      setError("Could not save job");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div
        className="w-80 rounded-lg p-6 bg-base-100 flex flex-col gap-4"
        data-theme="night"
      >
        <h1 className="text-xl font-bold text-center">ApplyTrack</h1>
        <p className="text-center text-base-content/50 text-sm">
          {isRegistering ? "Create an account" : "Login to continue"}
        </p>
        {loginError && (
          <p className="text-error text-sm text-center">{loginError}</p>
        )}
        {isRegistering && (
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered input-sm w-full"
            value={registerData.name}
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered input-sm w-full"
          value={isRegistering ? registerData.email : loginData.email}
          onChange={(e) =>
            isRegistering
              ? setRegisterData({ ...registerData, email: e.target.value })
              : setLoginData({ ...loginData, email: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered input-sm w-full"
          value={isRegistering ? registerData.password : loginData.password}
          onChange={(e) =>
            isRegistering
              ? setRegisterData({ ...registerData, password: e.target.value })
              : setLoginData({ ...loginData, password: e.target.value })
          }
        />
        <button
          className="btn btn-primary btn-sm w-full"
          onClick={isRegistering ? handleRegister : handleLogin}
        >
          {loginLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : isRegistering ? (
            "Register"
          ) : (
            "Login"
          )}
        </button>
        <p
          className="text-center text-sm cursor-pointer text-primary"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setLoginError(null);
          }}
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-96 min-h-fit bg-base-100 p-6" data-theme="night">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">ApplyTrack</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={handleThemeToggle}
            className="btn btn-ghost btn-sm btn-circle"
          >
            {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
          <button className="btn btn-xs btn-error" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : success ? (
        <div className="flex flex-col items-center justify-center h-40 gap-3">
          <p className="text-success text-lg font-bold">Job Saved!</p>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setSuccess(false);
              setError(null);
              setFormData({
                company: "",
                role: "",
                status: "Applied",
                source: "",
                jobUrl: "",
                notes: "",
              });
            }}
          >
            Add Another
          </button>

          <button
            className="btn btn-sm btn-primary"
            onClick={() =>
              chrome.tabs.create({
                url: "https://applytrack-eta.vercel.app/dashboard",
              })
            }
          >
            Dashboard
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {error && <p className="text-error text-sm text-center">{error}</p>}
          <input
            type="text"
            placeholder="Company"
            className="input input-bordered input-sm w-full"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Role"
            className="input input-bordered input-sm w-full"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <select
            className="select select-bordered select-sm w-full"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="Applied">Applied</option>
            <option value="Saved">Saved</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <input
            type="text"
            placeholder="Source (LinkedIn, Indeed...)"
            className="input input-bordered input-sm w-full"
            value={formData.source}
            onChange={(e) =>
              setFormData({ ...formData, source: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Job URL"
            className="input input-bordered input-sm w-full"
            value={formData.jobUrl}
            onChange={(e) =>
              setFormData({ ...formData, jobUrl: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Notes (optional)"
            className="input input-bordered input-sm w-full"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
          <button className="btn btn-primary w-full" onClick={handleSubmit}>
            Save Job
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
