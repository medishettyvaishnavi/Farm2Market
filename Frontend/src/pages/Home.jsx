import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    return (
        <div className="container text-center mt-5">

            <h1 className="display-4 fw-bold text-success">
                🌾 Farm2Market
            </h1>

            <p className="lead mt-3">
                Connect Farmers Directly With Buyers
            </p>

            <p className="text-muted">
                Sell your crops directly to suitable buyers near you.
            </p>

            <div className="mt-4">

                <button
                    className="btn btn-success me-2"
                    onClick={() => navigate("/farmer/login")}
                >
                    Farmer Login
                </button>

                <button
                    className="btn btn-outline-success"
                    onClick={() => navigate("/farmer/register")}
                >
                    Register
                </button>

                <button
                    className="btn btn-dark ms-2"
                    onClick={() => navigate("/buyer/marketplace")}
                >
                    Buyer Marketplace
                </button>

            </div>

        </div>
    );
}

export default Home;