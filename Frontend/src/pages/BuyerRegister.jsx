import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function BuyerRegister() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  return (
    <main className="auth-shell">
      <section className="auth-card auth-card-wide">
        <span className="eyebrow">FARM2MARKET / BUYER</span>
        <h1>Set up your buying desk.</h1>
        <p className="muted">A verified profile helps farmers trade with confidence.</p>
        <form onSubmit={handleSubmit(() => navigate("/buyer/marketplace"))}>
          <div className="form-grid"><label>Business or full name<input placeholder="e.g. Green Basket Foods" {...register("name", { required: "Name is required" })} />{errors.name && <small>{errors.name.message}</small>}</label><label>Mobile number<input placeholder="10-digit mobile number" {...register("mobile", { required: "Mobile number is required" })} />{errors.mobile && <small>{errors.mobile.message}</small>}</label></div>
          <label>Buying location<input placeholder="City, district or market" {...register("location", { required: "Location is required" })} />{errors.location && <small>{errors.location.message}</small>}</label>
          <div className="form-grid"><label>Password<input type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Use at least 6 characters" } })} />{errors.password && <small>{errors.password.message}</small>}</label><label>Confirm password<input type="password" {...register("confirm", { validate: value => value === password || "Passwords do not match" })} />{errors.confirm && <small>{errors.confirm.message}</small>}</label></div>
          <button className="primary-button" type="submit">Create buyer profile</button>
        </form>
        <p className="auth-footer">Already registered? <Link to="/buyer/login">Sign in</Link></p>
      </section>
    </main>
  );
}

export default BuyerRegister;