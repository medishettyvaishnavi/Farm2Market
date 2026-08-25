import { useState } from "react";

function FarmerDashboard() {
    const [form, setForm] = useState({
        cropName: "Cotton",
        variety: "Bt-Cotton Super 32",
        category: "Cash Crop",
        quantity: 45,
        unit: "Quintals",
        expectedPrice: 7600,
        location: "Khammam",
        state: "Telangana",
        harvestDate: "2026-09-20",
        grade: "Grade A (Premium)",
        isOrganic: false,
        language: "te"
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox"
                ? checked
                : type === "number"
                    ? Number(value)
                    : value
        });
    };

    const getRecommendation = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch(
                "http://localhost:5000/api/intelligence/recommend",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to get recommendation"
                );
            }

            setResult(data.data);
        } catch (err) {
            setError(
                err.message ||
                "Unable to connect to Farm2Market backend"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">

            <div className="text-center mb-5">
                <h1 className="fw-bold text-success">
                    🌾 Farmer Intelligence
                </h1>

                <p className="text-muted">
                    Enter your crop details to get a personalized
                    market recommendation.
                </p>
            </div>

            <div className="card shadow p-4 mb-4">

                <h3 className="text-success mb-4">
                    Crop Details
                </h3>

                <form onSubmit={getRecommendation}>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Crop Name
                            </label>

                            <input
                                className="form-control"
                                name="cropName"
                                value={form.cropName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Variety
                            </label>

                            <input
                                className="form-control"
                                name="variety"
                                value={form.variety}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Quantity
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Unit
                            </label>

                            <select
                                className="form-select"
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                            >
                                <option>Quintals</option>
                                <option>Kg</option>
                                <option>Tonnes</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Expected Price (₹)
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                name="expectedPrice"
                                value={form.expectedPrice}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Location
                            </label>

                            <input
                                className="form-control"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                State
                            </label>

                            <input
                                className="form-control"
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Harvest Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                name="harvestDate"
                                value={form.harvestDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Grade
                            </label>

                            <select
                                className="form-select"
                                name="grade"
                                value={form.grade}
                                onChange={handleChange}
                            >
                                <option>Grade A (Premium)</option>
                                <option>Grade B</option>
                                <option>Grade C</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Language
                            </label>

                            <select
                                className="form-select"
                                name="language"
                                value={form.language}
                                onChange={handleChange}
                            >
                                <option value="en">English</option>
                                <option value="te">Telugu</option>
                                <option value="hi">Hindi</option>
                            </select>
                        </div>

                        <div className="col-12 mb-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isOrganic"
                                    checked={form.isOrganic}
                                    onChange={handleChange}
                                    id="organic"
                                />

                                <label
                                    className="form-check-label"
                                    htmlFor="organic"
                                >
                                    Organic Crop
                                </label>
                            </div>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-success w-100 py-2"
                        disabled={loading}
                    >
                        {loading
                            ? "Analyzing..."
                            : "Get Market Recommendation"}
                    </button>

                </form>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {result && (
                <div className="card shadow p-4">

                    <h3 className="text-success mb-4">
                        📊 Market Recommendation
                    </h3>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <strong>Crop:</strong>
                            <p>{result.crop}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Market:</strong>
                            <p>{result.mandi}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Current Price:</strong>
                            <p>₹{result.currentModalPrice}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Price Trend:</strong>
                            <p>{result.priceTrend}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Price Change:</strong>
                            <p>{result.changePercent}</p>
                        </div>

                        <div className="col-md-6 mb-3">
                            <strong>Best Time to Sell:</strong>
                            <p>{result.bestTimeToSell}</p>
                        </div>

                    </div>

                    <div className="alert alert-success">
                        <strong>Recommendation:</strong>
                        <br />
                        {result.recommendation}
                    </div>

                    <div className="alert alert-info">
                        <strong>Advisory:</strong>
                        <br />
                        {result.advisoryText}
                    </div>

                    <h5 className="mt-4">
                        7-Day Projected Prices
                    </h5>

                    <div className="table-responsive">
                        <table className="table table-bordered mt-3">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Projected Price</th>
                                </tr>
                            </thead>

                            <tbody>
                                {result.predictedPrices7Days?.map(
                                    (item) => (
                                        <tr key={item.day}>
                                            <td>{item.day}</td>
                                            <td>₹{item.price}</td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}

        </div>
    );
}

export default FarmerDashboard;