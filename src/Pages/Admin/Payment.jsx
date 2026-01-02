import { useEffect, useState } from "react";
import Sidebar from "../../Component/Sidebar";
import { FaCog } from "react-icons/fa";
import axios from "axios";

const Payment = () => {
    const [transactionsData, setTransactionsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const res = await axios.get(
                    "http://localhost:9000/payments",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setTransactionsData(res.data.payments || []);
                setLoading(false);
            } catch (err) {
                console.error("Payment fetch error:", err);
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("All");

    /* ================= FILTER ================= */
    const filteredData =
        filterStatus === "All"
            ? transactionsData
            : transactionsData.filter(
                  item =>
                      item.status.toLowerCase() ===
                      filterStatus.toLowerCase()
              );

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    if (loading) {
        return (
            <div className="admin">
                <Sidebar />
                <div className="admin-content p-4">
                    Loading payments...
                </div>
            </div>
        );
    }

    /* ================= STATS (FIXED) ================= */

    // Revenue = PAID only (exclude refunded & failed)
    const totalRevenue = transactionsData
        .filter(t => t.status === "Paid")
        .reduce((sum, t) => sum + t.amount, 0);

    // Pending = unpaid COD / pending gateway
    const pendingAmount = transactionsData
        .filter(t => t.status === "Pending")
        .reduce((sum, t) => sum + t.amount, 0);

    // Failed count
    const failedCount = transactionsData.filter(
        t => t.status === "Failed"
    ).length;

    // COD vs ONLINE (internal use, future graph ready)
    const codTotal = transactionsData
        .filter(t => t.method === "COD" && t.status === "Paid")
        .reduce((sum, t) => sum + t.amount, 0);

    const onlineTotal = transactionsData
        .filter(
            t =>
                t.method !== "COD" &&
                t.status === "Paid"
        )
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="admin">
            <Sidebar />

            <div className="admin-content payment-page">
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold mb-0">
                        Payments Management
                    </h2>
                    <div className="d-flex align-items-center gap-3">
                        <FaCog className="fs-5 cursor-pointer text-muted" />
                        <img
                            src={require("../../Img/admin.webp")}
                            alt="Admin"
                            className="admin-avatar"
                        />
                    </div>
                </div>

                {/* FILTER BUTTONS */}
                <div className="btn-group mb-4">
                    {["All", "Paid", "Pending", "Failed"].map(
                        status => (
                            <button
                                key={status}
                                className={`btn filter-btn ${
                                    filterStatus === status
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => {
                                    setFilterStatus(status);
                                    setCurrentPage(1);
                                }}
                            >
                                {status}
                            </button>
                        )
                    )}
                </div>

                {/* STATS */}
                <div className="row g-3 mb-4">
                    <StatCard
                        title="Total Revenue"
                        value={`₹${totalRevenue}`}
                        color="green"
                    />
                    <StatCard
                        title="Pending Payouts"
                        value={`₹${pendingAmount}`}
                        color="blue"
                    />
                    <StatCard
                        title="Refund Rate"
                        value="—"
                        color="orange"
                    />
                    <StatCard
                        title="Failed Txns"
                        value={failedCount}
                        color="red"
                    />
                </div>

                {/* TABLE */}
                <div className="card payment-card">
                    <div className="card-body">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Transaction</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentData.length > 0 ? (
                                    currentData.map(item => (
                                        <tr
                                            key={item.id}
                                            className="fade-in"
                                        >
                                            <td>
                                                <span
                                                    className={`status-badge ${item.status.toLowerCase()}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                <strong>{item.id}</strong>
                                                <br />
                                                <small className="text-muted">
                                                    {new Date(
                                                        item.date
                                                    ).toLocaleString()}
                                                </small>
                                            </td>
                                            <td>
                                                <strong>
                                                    {item.customer}
                                                </strong>
                                                <br />
                                                <small className="text-muted">
                                                    {item.email}
                                                </small>
                                            </td>
                                            <td className="fw-bold">
                                                ₹{item.amount}
                                            </td>
                                            <td>{item.method}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-4"
                                        >
                                            No {filterStatus} transactions
                                            found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* PAGINATION */}
                        {filteredData.length >
                            itemsPerPage && (
                            <div className="d-flex justify-content-between align-items-center">
                                <small>
                                    Showing {startIndex + 1} to{" "}
                                    {Math.min(
                                        startIndex +
                                            itemsPerPage,
                                        filteredData.length
                                    )}{" "}
                                    of {filteredData.length}
                                </small>

                                <div>
                                    <button
                                        className="btn btn-sm border border-secondary btn-outline-secondary me-2"
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage(p => p - 1)
                                        }
                                    >
                                        Previous
                                    </button>

                                    <button
                                        className="btn btn-sm border border-primary btn-outline-primary"
                                        disabled={
                                            currentPage === totalPages
                                        }
                                        onClick={() =>
                                            setCurrentPage(p => p + 1)
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => {
    return (
        <div className="col-lg-3 col-md-6">
            <div className={`stat-card ${color}`}>
                <p>{title}</p>
                <h5>{value}</h5>
            </div>
        </div>
    );
};

export default Payment;
