import { useForm } from "react-hook-form";
import { FaMobileAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function FarmerLogin() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
    	console.log("Login Data:", data);
    	navigate("/farmer/dashboard");
    };     

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div
                className="card shadow p-4 my-4"
                style={{ width: "420px", borderRadius: "15px" }}
            >
                {/* Header */}
                <div className="text-center mb-4">
                    <h2
                        className="fw-bold text-success cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        🌾 Farm2Market
                    </h2>
                    <p className="text-muted mb-0">Farmer Login</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Mobile Number */}
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
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                            />
                        </div>
                        {errors.password && (
                            <small className="text-danger">
                                {errors.password.message}
                            </small>
                        )}
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="btn btn-success w-100 mt-2 py-2 fw-semibold"
                    >
                        Login
                    </button>
                </form>

                {/* Footer / Register link */}
                <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                        Don't have an account?{" "}
                        <Link
                            to="/farmer/register"
                            className="text-success fw-semibold text-decoration-none"
                        >
                            Register
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

export default FarmerLogin;
