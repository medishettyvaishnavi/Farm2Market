import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaLock, FaUserShield, FaEnvelope } from "react-icons/fa";

function NgoLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    setErrorMsg("");
    // Create virtual email if mobile is entered, or use email direct
    const isEmail = data.identifier.includes("@");
    const loginParams = isEmail 
      ? { email: data.identifier, password: data.password, role: "ngo" }
      : { mobile: data.identifier, password: data.password, role: "ngo" };

    const res = await login(loginParams);
    if (res.success) {
      navigate("/ngo/dashboard");
    } else {
      setErrorMsg("Invalid credentials. Please try again.");
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="text-center mb-3">
          <div className="d-inline-flex bg-success text-white rounded-circle p-3 mb-2">
            <FaUserShield size={24} />
          </div>
          <span className="eyebrow d-block">FARM2MARKET / NGO PORTAL</span>
          <h1>Ecosystem Monitoring Desk</h1>
          <p className="muted">Sign in to monitor villages, verify farmers and track direct transactions.</p>
        </div>

        {errorMsg && <div className="alert alert-danger py-2 rounded-3 text-center small">{errorMsg}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Mobile number or Email
            <div className="input-group mt-1">
              <input 
                type="text" 
                placeholder="e.g. ngo@farm2market.in or 10-digit number" 
                {...register("identifier", { required: "Mobile number or email is required" })} 
              />
            </div>
            {errors.identifier && <small className="text-danger mt-1 d-block">{errors.identifier.message}</small>}
          </label>

          <label className="mt-3">
            Password
            <div className="input-group mt-1">
              <input 
                type="password" 
                placeholder="Enter password" 
                {...register("password", { required: "Password is required" })} 
              />
            </div>
            {errors.password && <small className="text-danger mt-1 d-block">{errors.password.message}</small>}
          </label>

          <button className="primary-button mt-4 w-100" type="submit">
            Enter NGO Dashboard
          </button>
        </form>
        
        <p className="auth-footer mt-3 text-center">
          Need partner access? Contact ecosystem admin.
        </p>
        <Link className="back-link d-block text-center mt-3" to="/">
          Back to home
        </Link>
      </section>
    </main>
  );
}

export default NgoLogin;
