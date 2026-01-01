import { useState, useEffect } from "react";
import { FaUserCog, FaShoppingBag, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../../Context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserSettings = () => {
  const { user, setUser, logout } = useCart();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("settings");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================
     ACCOUNT SETTINGS STATES
  ========================== */
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  /* SYNC USER DATA */
  useEffect(() => {
    if (user) {
      setFullname(user.fullname || "");
      setEmail(user.email || "");
      setPreview(
        user.profile
          ? user.profile.startsWith("http")
            ? user.profile
            : `http://localhost:9000${user.profile}`
          : "/img/user.webp"
      );
    }
  }, [user]);

  /* UPDATE USER */
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");

      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("email", email);
      if (password) formData.append("password", password);
      if (profile) formData.append("profile", profile);

      const res = await axios.put("http://localhost:9000/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const updatedUser = {
          ...res.data.user,
          profile: res.data.user.profile.startsWith("http")
            ? res.data.user.profile
            : `http://localhost:9000${res.data.user.profile}`,
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMessage("Profile updated successfully!");
      }
    } catch (err) {
      setMessage("Update failed");
    }
  };

  /* DELETE ACCOUNT */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete("http://localhost:9000/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/");
    } catch {
      setMessage("Delete failed");
    }
  };

  return (
    <div className="container">
      <div className="account-wrapper">
        {/* MOBILE HEADER */}
        <div className="mobile-header">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* SIDEBAR */}
        <aside className={`account-sidebar ${sidebarOpen ? "open" : ""}`}>
          <button
            className={activeSection === "settings" ? "active" : ""}
            onClick={() => {
              setActiveSection("settings");
              setSidebarOpen(false);
            }}
          >
            <FaUserCog /> Account Settings
          </button>

          <button
            className={activeSection === "orders" ? "active" : ""}
            onClick={() => {
              setActiveSection("orders");
              setSidebarOpen(false);
            }}
          >
            <FaShoppingBag /> My Orders
          </button>
        </aside>

        {/* CONTENT */}
        <main className="account-content">
          <div key={activeSection} className="content-animate">
            {activeSection === "orders" && <MyOrders />}
            {activeSection === "settings" && (
              <div className="user-settings py-4">
                <h3>User Settings</h3>

                {message && <p className="text-success">{message}</p>}

                {/* PROFILE IMAGE */}
                <div className="mb-3 text-center">
                  <img
                    src={preview}
                    alt="profile"
                    className="rounded-circle"
                    width="120"
                    height="120"
                  />
                  <input
                    type="file"
                    className="form-control mt-2"
                    accept="image/*"
                    onChange={(e) => {
                      setProfile(e.target.files[0]);
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                </div>

                <form onSubmit={handleUpdate}>
                  <div className="form-group my-2">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group my-2">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group my-2">
                    <label>New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary my-2">
                    Update Profile
                  </button>
                </form>

                <hr />

                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete Account
                </button>

                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserSettings;

/* ========================================
   MY ORDERS COMPONENT (updated)
======================================== */

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get("http://localhost:9000/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ordersData = res.data.orders || [];
      const now = new Date();

      // Filter: keep cancelled orders for 48 hours
      const filteredOrders = ordersData.filter((order) => {
        if (order.orderStatus?.toLowerCase() === "cancelled") {
          const cancelledAt = new Date(order.updatedAt);
          const diffInHours = (now - cancelledAt) / (1000 * 60 * 60);
          return diffInHours <= 48; // show only if less than 2 days
        }
        return true; // show all other orders
      });

      setOrders(filteredOrders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("userToken");

      const res = await axios.put(
        `http://localhost:9000/cancel-order/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        // Update local order status immediately
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? { ...o, orderStatus: "cancelled", updatedAt: new Date().toISOString() }
              : o
          )
        );
      }
    } catch (err) {
      alert("Unable to cancel order");
      console.error(err);
    }
  };

  // Download invoice
const downloadInvoice = async (orderId) => {
  try {
    const token = localStorage.getItem("userToken");

    const { data } = await axios.get(
      `http://localhost:9000/invoice/${orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([data], { type: "application/pdf" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (err) {
    console.error(err);
    alert("Failed to download invoice");
  }
};

  if (loading) return <div className="text-center py-5">Loading orders...</div>;

  return (
    <div className="orders-page">
      <h3 className="mb-4">My Orders</h3>

      {orders.length === 0 ? (
        <div className="alert alert-info">You have not placed any orders yet.</div>
      ) : (
        orders.map((order) => (
          <div className="card mb-3 shadow-sm" key={order._id}>
            <div className="card-body">
              <div className="row align-items-center">
                {/* LEFT */}
                <div className="col-md-8">
                  <p className="mb-1">
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mb-1">
                    <strong>Payment:</strong> {order.paymentMethod}
                  </p>
                  <p className="mb-0">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        order.orderStatus === "delivered"
                          ? "bg-success"
                          : order.orderStatus === "cancelled"
                          ? "bg-danger"
                          : order.orderStatus === "pending"
                          ? "bg-secondary"
                          : order.orderStatus === "confirmed"
                          ? "bg-primary"
                          : "text-bg-dark"
                      }`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </p>
                </div>

                {/* RIGHT */}
                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <h5 className="mb-2">₹{order.total}</h5>

                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    disabled={
                      order.orderStatus?.toLowerCase() === "cancelled" ||
                      order.orderStatus?.toLowerCase() === "delivered"
                    }
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => downloadInvoice(order.orderId)}
                  >
                    Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};