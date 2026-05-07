import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const { login, error } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
    if (!error) {
      navigate("/", { replace: true });
    }
  };
  return (
    <div className="flex flex-col min-h-screen items-center justify-center ">
      <div className="card bg-base-200 card-bordered card-normal  w-fit p-10">
        <div className="card-body ">
          <h1 className=" card-title text-base-content/95  text-center font-bold text-3xl items-center justify-center">
            Login
          </h1>

          <form className="form flex flex-col  " action="post">
            <div className="gap-3 flex flex-col">
              <input
                type="email"
                name="email"
                className="input input-bordered w-fit text-center mx-auto px-9"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              {error && <p className="text-error text-sm">{error}</p>}
              <input
                type="password"
                className="input input-bordered px-9 mx-auto w-fit text-center"
                value={formData.password}
                name="password"
                onChange={handleChange}
                placeholder="Password"
                required
              />

              <button
                className="btn btn-primary text-center text-lg "
                onClick={handleSubmit}
              >
                Login
              </button>
            </div>
            <div className="flex flex-col  text-center gap-0">
              <p className="text-base-content/50 text-center mt-3">
                Don't have an account?
              </p>
              <a
                onClick={() => navigate("/register")}
                className="text-primary cursor-pointer"
              >
                Register
              </a>
              <p
                className="text-center text-sm cursor-pointer text-primary mt-2"
                onClick={() => navigate("/forgotpassword")}
              >
                Forgot Password?
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
