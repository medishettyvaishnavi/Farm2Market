import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { api, saveSession } from "../services/api";

function BuyerLogin() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <span className="eyebrow">FARM2MARKET / BUYER</span>
        <h1>Buy closer to the harvest.</h1>
        <p className="muted">Sign in to source fresh crops from verified local farmers.</p>
        <form onSubmit={handleSubmit(async data => { try { saveSession(await api.login(data)); navigate("/buyer/marketplace"); } catch (error) { setServerError(error.message); } })}>
          <label>Mobile number<input type="tel" placeholder="10-digit mobile number" {...register("mobile", { required: "Mobile number is required", pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" } })} />{errors.mobile && <small>{errors.mobile.message}</small>}</label>
          <label>Password<input type="password" placeholder="Your password" {...register("password", { required: "Password is required" })} />{errors.password && <small>{errors.password.message}</small>}</label>
          <button className="primary-button" type="submit">Open buyer dashboard</button>
          {serverError && <small>{serverError}</small>}
        </form>
        <p className="auth-footer">New buyer? <Link to="/buyer/register">Create an account</Link></p>
        <Link className="back-link" to="/">Back to home</Link>
      </section>
    </main>
  );
}

export default BuyerLogin;