import Sidebar from "../../Component/Sidebar"
import { useState } from "react";
import { FaPercentage, FaCalendarAlt, FaSave } from "react-icons/fa";
import axios from "axios";

const Coupen = () => {

  const [coupen, setCoupon] = useState({
    code: "",
    description: "",
    active: true,
    startDate: "",
    expiryDate: "",
    discountType: "percentage",
    discountValue: "",
    appliesTo: "entire",
    limitPerCoupon: "",
    limitPerUser: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCoupon({ ...coupen, [name]: type === "checkbox" ? checked : value });
  };

  const generateCode = () => {
    const code = "SALE" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setCoupon({ ...coupen, code });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:9000/coupen-create",
        coupen,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Coupon Created Successfully");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Unauthorized or error creating coupon");
    }
  };


  return (
    <div className="admin">
      <Sidebar />
      <div className="admin-content">
        <div className="coupen-container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="fw-bold mb-0">Create New Coupen</h2>
              <p className="text-muted">
                Configure discount rules, restrictions, and validity period.
              </p>
            </div>

            <button className="btn btn-primary" onClick={handleSubmit}>
              <FaSave className="me-2" /> Save Coupen
            </button>
          </div>

          <div className="row g-4">
            {/* LEFT */}
            <div className="col-lg-8">
              <div className="card p-4 mb-4">
                <h6 className="section-title">General Information</h6>

                <label>Coupen Code</label>
                <div className="d-flex gap-2">
                  <input
                    className="form-control"
                    placeholder="E.G. SUMMER2024"
                    name="code"
                    value={coupen.code}
                    onChange={handleChange}
                  />
                  <button className="btn btn-outline-primary" onClick={generateCode}>
                    Generate
                  </button>
                </div>

                <label className="mt-3">Description (Optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Internal notes about this promotion..."
                  name="description"
                  value={coupen.description}
                  onChange={handleChange}
                />
              </div>

              <div className="card p-4">
                <h6 className="section-title">
                  <FaPercentage className="me-2" /> Discount Rules
                </h6>

                <div className="row">
                  <div className="col-md-6">
                    <label>Discount Type</label>
                    <select
                      className="form-select"
                      name="discountType"
                      onChange={handleChange}
                    >
                      <option value="percentage">Percentage Discount (%)</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Discount Value</label>
                    <input
                      className="form-control"
                      name="discountValue"
                      value={coupen.discountValue}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <label className="mt-3">Applies To</label>
                <select
                  className="form-select"
                  name="appliesTo"
                  onChange={handleChange}
                >
                  <option value="entire">Entire Order</option>
                  <option value="product">Specific Product</option>
                  <option value="category">Specific Category</option>
                </select>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-lg-4">
              <div className="card p-4 mb-4">
                <h6 className="section-title">Status</h6>

                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="active"
                    checked={coupen.active}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Active</label>
                </div>
              </div>

              <div className="card p-4 mb-4">
                <h6 className="section-title">
                  <FaCalendarAlt className="me-2" /> Schedule
                </h6>

                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  onChange={handleChange}
                />

                <label className="mt-3">Expiry Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="expiryDate"
                  onChange={handleChange}
                />
              </div>

              <div className="card p-4">
                <h6 className="section-title">Usage Limits</h6>

                <label>Limit per Coupen</label>
                <input
                  className="form-control"
                  name="limitPerCoupon"
                  placeholder="e.g. 100"
                  onChange={handleChange}
                />

                <label className="mt-3">Limit per User</label>
                <input
                  className="form-control"
                  name="limitPerUser"
                  placeholder="e.g. 1"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Coupen
