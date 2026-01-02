import { useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";

const statusProgress = {
  pending: 20,
  confirmed: 40,
  shipped: 60,
  delivered: 100,
};

const Track = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    if (!orderId) return;

    try {
      const res = await axios.get(
        `http://localhost:9000/track/${orderId}`
      );
      setOrder(res.data.order);
      setError("");
    } catch (err) {
      setOrder(null);
      setError("Order not found");
    }
  };

  return (
    <div className="track-page py-5">
      <div className="container">

        {/* TITLE + SEARCH */}
        <div className="mb-4">
          <span className="badge bg-success-subtle text-success mb-3">
            ORDER TRACKING
          </span>
          <h1 className="fw-bold mt-2">TRACK YOUR ORDER</h1>

          <div className="input-group track-search">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <button className="btn btn-danger" onClick={fetchOrder}>
              <FaSearch />
            </button>
          </div>

          {error && <p className="text-danger mt-2">{error}</p>}
        </div>

        {order && (
          <div className="row g-4">

            {/* CURRENT STATUS */}
            <div className="col-lg-6">
              <div className="card shadow-sm track-card h-100">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted">
                    Current Status
                  </h6>

                  <h3 className="fw-bold text-danger">
                    {order.status.toUpperCase()}
                  </h3>

                  <div className="d-flex align-items-start discreet-box mt-3">
                    <FaBoxOpen className="icon" />
                    <div>
                      <strong>Discreet Packaging Guarantee</strong>
                      <p className="mb-0 text-muted">
                        Unbranded packaging. Sender listed as "PL Logistics".
                      </p>
                    </div>
                  </div>

                  <div className="progress mt-4">
                    <div
                      className="progress-bar bg-danger"
                      style={{
                        width: `${statusProgress[order.status]}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT BOX */}
            <div className="col-lg-6">
              <div className="card shadow-sm track-card product-card h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="product-icon me-3">📦</div>
                  <div>
                    <h5 className="mb-1">
                      {order.items[0]?.title}
                    </h5>
                    <h6>Order ID : {order.orderId}</h6>
                    <strong>₹{order.total}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVITY LOG */}
            <div className="col-12">
              <div className="card shadow-sm track-card">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted mb-3">
                    Activity Log
                  </h6>

                  <ul className="list-unstyled timeline">
                    {order.timeline.map((t) => {
                      const active =
                        statusProgress[order.status] >=
                        statusProgress[t.key];

                      return (
                        <li
                          key={t.key}
                          className={`timeline-item ${
                            active ? "active" : "inactive"
                          }`}
                        >
                          <FaCheckCircle />
                          <div>
                            <strong>{t.label}</strong>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Track;
