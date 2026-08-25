import { useForm } from "react-hook-form";
import { FaUser, FaMobileAlt, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

function FarmerRegister() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch("password");

    const onSubmit = (data) => {
        console.log("Registration Data:", data);
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">

            <div
                className="card shadow p-4 my-4"
                style={{ width: "450px", borderRadius: "15px" }}
            >

                {/* Header */}
                <div className="text-center mb-4">

                    <h2 className="fw-bold text-success">
                        🌾 Farm2Market
                    </h2>

                    <p className="text-muted">
                        Create Farmer Account
                    </p>

                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Name */}
                    <div className="mb-3">

                        <label className="form-label fw-semibold">
                            Full Name
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <FaUser />
                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your name"
                                {...register("name", {
                                    required: "Name is required",
                                })}
                            />

                        </div>

                        {errors.name && (
                            <small className="text-danger">
                                {errors.name.message}
                            </small>
                        )}

                    </div>

                    {/* Mobile */}
                    <div className="mb-3">

                        <label className="form-label fw-semibold">
                            Mobile Number
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <FaMobileAlt />
                            </span>

                            <input
                                type="tel"
                                className="form-control"
                                placeholder="Enter 10-digit mobile number"
                                {...register("mobile", {
                                    required: "Mobile number is required",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Enter a valid 10-digit mobile number",
                                    },
                                })}
                            />

                        </div>

                        {errors.mobile && (
                            <small className="text-danger">
                                {errors.mobile.message}
                            </small>
                        )}

                    </div>

                    {/* Location */}
                    <div className="mb-3">

                        <label className="form-label fw-semibold">
                            Village / Location
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your village or location"
                            {...register("location", {
                                required: "Location is required",
                            })}
                        />

                        {errors.location && (
                            <small className="text-danger">
                                {errors.location.message}
                            </small>
                        )}

                    </div>

                    {/* Password */}
                    <div className="mb-3">

                        <label className="form-label fw-semibold">
                            Password
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                <FaLock />
                            </span>

                            <input
                                type="password"
                                className="form-control"
                                placeholder="Create password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must contain at least 6 characters",
                                    },
                                })}
                            />

                        </div>

                        {errors.password && (
                            <small className="text-danger">
                                {errors.password.message}
                            </small>
                        )}

                    </div>

                    {/* Confirm Password */}
                    <div className="mb-3">

                        <label className="form-label fw-semibold">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === password || "Passwords do not match",
                            })}
                        />

                        {errors.confirmPassword && (
                            <small className="text-danger">
                                {errors.confirmPassword.message}
                            </small>
                        )}

                    </div>

                    {/* Language */}
                    <div className="mb-3">

                        <label className="form-label fw-semibold">
                            Preferred Language
                        </label>

                        <select
                            className="form-select"
                            {...register("language")}
                        >
                            <option value="english">English</option>
                            <option value="telugu">తెలుగు</option>
                            <option value="hindi">हिन्दी</option>
                        </select>

                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="btn btn-success w-100 mt-2 py-2 fw-semibold"
                    >
                        Create Account
                    </button>

                </form>

                {/* Footer / Login link */}
                <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                        Already have an account?{" "}
                        <Link
                            to="/farmer/login"
                            className="text-success fw-semibold text-decoration-none"
                        >
                            Login
                        </Link>
                    </p>
                    <div className="mt-2">
                        <Link
                            to="/"
                            className="text-secondary small text-decoration-none"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default FarmerRegister;