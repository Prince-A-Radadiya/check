import { useEffect, useState } from "react";
import Sidebar from "../../Component/Sidebar";
import axios from "axios";
import { FaCog } from "react-icons/fa";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("all"); // all / pending / confirmed
    const ordersPerPage = 5;

    // ================= FETCH ORDERS =================
    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("http://localhost:9000/get-orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
            });
            setOrders(data.orders || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ================= UPDATE STATUS =================
    const acceptOrder = async (id) => {
        try {
            await axios.put(
                `http://localhost:9000/order/${id}`,
                { orderStatus: "confirmed" },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    },
                }
            );
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    const acceptAllOrders = async () => {
        const pendingOrders = orders.filter((o) => o.orderStatus === "pending");
        for (const order of pendingOrders) {
            await acceptOrder(order._id);
        }
    };

    // ================= DOWNLOAD LABEL =================
    const downloadLabel = async (orderId) => {
        try {
            const { data } = await axios.get(
                `http://localhost:9000/order/${orderId}/label`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `order-${orderId}-label.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Error downloading label:", err);
        }
    };

    const downloadAllLabels = async () => {
        const ordersToDownload = orders.filter(
            o => o.orderStatus !== "pending" && !o.labelDownloaded
        );

        for (const order of ordersToDownload) {
            await downloadLabel(order._id);
        }

        fetchOrders(); // refresh after download
    };


    // ================= FILTER =================
    const filteredOrders = orders.filter((order) => {
        // Ignore cancelled orders older than 1 day
        if (order.orderStatus === "cancelled") {
            const cancelledTime = new Date(order.updatedAt);
            const now = new Date();
            const diffInHours = (now - cancelledTime) / (1000 * 60 * 60); // difference in hours
            if (diffInHours > 24) return false; // skip cancelled orders older than 1 day
        }

        if (filterStatus === "all") return true;
        return order.orderStatus === filterStatus;
    });


    // ================= PAGINATION =================
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const indexOfLast = currentPage * ordersPerPage;
    const indexOfFirst = indexOfLast - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

    const getPageNumbers = () => {
        const pages = [];
        let start = Math.max(currentPage - 1, 1);
        let end = Math.min(start + 2, totalPages);

        if (end - start < 2) start = Math.max(end - 2, 1); // always 3 pages if possible

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            await axios.put(
                `http://localhost:9000/order/${orderId}`,
                { orderStatus: status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    },
                }
            );
            fetchOrders();
        } catch (err) {
            console.error("Status update failed:", err);
        }
    };


    return (
        <div className="admin">
            <Sidebar />
            <div className="admin-content admin-order fade-in">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="page-title fw-bold mb-0">Orders Management</h2>
                    {/* <p className="page-subtitle">Manage, track and update customer orders</p> */}

                    <div className="d-flex align-items-center gap-3">
                        <FaCog className="fs-5 cursor-pointer text-muted" />

                        <img
                            src={require('../../Img/admin.webp')}
                            alt="Admin"
                            className="admin-avatar"
                        />
                    </div>
                </div>

                {/* ================= FILTER & ACTION BUTTONS ================= */}
                <div className="mb-3 d-flex gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="form-select w-auto"
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                    </select>

                    <button className="btn btn-success" onClick={acceptAllOrders}>
                        Accept All
                    </button>
                    <button className="btn btn-primary" onClick={downloadAllLabels}>
                        Download All Labels
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={downloadAllLabels}
                        disabled={
                            orders.filter(
                                o => o.orderStatus !== "pending" && !o.labelDownloaded
                            ).length === 0
                        }
                    >
                        Download Pending Labels
                    </button>

                </div>

                {/* ================= TABLE ================= */}
                <div className="orders-card">
                    <table className="orders-table text-center">
                        <thead>
                            <tr>
                                <th className="text-center">Product IMG</th>
                                <th className="text-center">Order ID</th>
                                <th className="text-center">Customer</th>
                                {/* <th className="text-center">Date</th> */}
                                {/* <th className="text-center">Payment</th> */}
                                <th className="text-center">Status</th>
                                <th className="text-center">Total</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map((order) =>
                                order.items?.map((item, index) => (
                                    <tr key={`${order._id}-${item.productId?._id || index}`}>
                                        {/* PRODUCT IMAGE */}
                                        <td>
                                            {item.productId ? (
                                                <>
                                                    <img
                                                        src={
                                                            item.productId.images?.[0]
                                                                ? `http://localhost:9000${item.productId.images[0]}`
                                                                : item.image || "/img/default-product.png"
                                                        }
                                                        alt={item.productId.title || item.title || "Product"}
                                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                    />
                                                    {/* <div>{item.productId.title || item.title}</div> */}
                                                    <div>Qty: {item.qty}</div>
                                                </>
                                            ) : (
                                                <span>No product info</span>
                                            )}
                                        </td>

                                        {/* ORDER INFO - only show in first row of this order */}
                                        {index === 0 && (
                                            <>
                                                <td rowSpan={order.items.length}>{order.orderId}
                                                    <div>{item.productId.title || "Pr Name : " + item.title}</div>
                                                </td>
                                                <td rowSpan={order.items.length}>
                                                    <div className="customer">
                                                        <strong>{order.shippingAddress?.name}</strong>
                                                        <span>{order.email}</span>
                                                    </div>
                                                </td>
                                                <td rowSpan={order.items.length}>
                                                    <span className={`status ${order.orderStatus}`}>{order.orderStatus}</span>
                                                </td>
                                                <td rowSpan={order.items.length}>₹{order.total}</td>
                                                <td rowSpan={order.items.length}>

                                                    {order.orderStatus === "pending" && (
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => updateOrderStatus(order._id, "confirmed")}
                                                        >
                                                            Accept
                                                        </button>
                                                    )}

                                                    {order.orderStatus === "confirmed" && (
                                                        <button
                                                            className="btn btn-warning btn-sm"
                                                            onClick={() => updateOrderStatus(order._id, "shipped")}
                                                        >
                                                            Ship
                                                        </button>
                                                    )}

                                                    {order.orderStatus === "shipped" && (
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => updateOrderStatus(order._id, "delivered")}
                                                        >
                                                            Delivered
                                                        </button>
                                                    )}
                                                </td>

                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>

                {/* ================= PAGINATION ================= */}
                <div className="pagination d-flex justify-content-center align-items-center mt-3 gap-1">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        &lt;
                    </button>

                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? "active page-btn" : "page-btn"}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Orders;
