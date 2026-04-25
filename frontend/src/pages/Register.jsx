import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { error, register } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData.name,formData.email, formData.password);
    if (!error) {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="card bg-base-200 card-bordered card-normal w-fit p-10">
        <div className="card-body">
          <h1 className="card-title font-bold text-3xl items-center justify-center flex flex-col">
            Register
          </h1>
        </div>

        <form className="form " action='post' onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              className="input input-bordered w-fit text-center mx-auto px-9"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <input
              type="email"
              name="email"
              className="input input-bordered w-fit text-center mx-auto px-9"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              className="input input-bordered w-fit text-center mx-auto px-9"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <button className="btn btn-primary text-center text-lg " >
              Register
            </button>
          </div>

          <div className="flex flex-col text-center gap-0">
            <p className="text-base-content/50 text-center mt-3 ">
              Already have an account?
            </p>
            <a
              onClick={() => navigate("/login")}
              className="text-primary cursor-pointer"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
