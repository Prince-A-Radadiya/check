import { useEffect, useState } from "react";
import { FaSearch, FaCog } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Sidebar from "../../Component/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CoupenEdit = () => {
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchCoupons = async () => {
    const res = await axios.get(
      `http://localhost:9000/coupen-list?page=${page}&search=${search}&status=${status}`
    );
    setCoupons(res.data.coupens);
    setPages(res.data.pages);
  };

  useEffect(() => {
    fetchCoupons();
  }, [page, search, status]);


  const updateCoupon = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:9000/coupen-update/${selectedCoupon._id}`,
        selectedCoupon,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOpenDrawer(false);
      fetchCoupons();
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      alert("Unauthorized or update failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="admin">
      <Sidebar />
      <div className="admin-content">
        <div className="coupen-page">

          {/* PAGE HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Coupen Management</h2>
            <div className="d-flex align-items-center gap-3">
              <FaCog className="fs-5 cursor-pointer text-muted" />

              <img
                src={require('../../Img/admin.webp')}
                alt="Admin"
                className="admin-avatar"
              />
            </div>
          </div>

          {/* FILTER */}
          <div className="filter-bar mb-3">
            <div className="search-box border">
              <FaSearch />
              <input
                placeholder="Search by coupon code..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="card">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>CODE</th>
                  <th>DISCOUNT</th>
                  <th>USAGE</th>
                  <th>STATUS</th>
                  <th>EXPIRY</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <strong>{c.code}</strong>
                      <div className="text-muted small">{c.description}</div>
                    </td>

                    <td>
                      {c.discountType === "percentage"
                        ? `${c.discountValue}% OFF`
                        : `₹${c.discountValue} OFF`}
                    </td>

                    <td>
                      {c.usedCount} / {c.limitPerCoupon || "∞"}
                      <div className="progress mt-1">
                        <div
                          className="progress-bar"
                          style={{
                            width: c.limitPerCoupon
                              ? `${(c.usedCount / c.limitPerCoupon) * 100}%`
                              : "100%",
                          }}
                        />
                      </div>
                    </td>

                    <td>
                      <span className={c.active ? "text-success" : "text-danger"}>
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {c.expiryDate
                        ? new Date(c.expiryDate).toDateString()
                        : "No Expiry"}
                    </td>

                    <td>
                      <MdEdit
                        size={20}
                        className="text-primary cursor-pointer"
                        onClick={() => {
                          setSelectedCoupon(c);
                          setOpenDrawer(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="pagination-bar">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                ‹
              </button>
              <span>Page {page} of {pages}</span>
              <button disabled={page === pages} onClick={() => setPage(page + 1)}>
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT DRAWER */}
      {openDrawer && selectedCoupon && (
        <div className="coupon-drawer">
          <div className="drawer-header">
            <h5 className="mb-0">Edit Coupon</h5>
            <button onClick={() => setOpenDrawer(false)}>✕</button>
          </div>

          <div className="drawer-body">
            <label>Coupon Code</label>
            <input value={selectedCoupon.code} disabled />

            <label>Description</label>
            <input
              value={selectedCoupon.description || ""}
              onChange={(e) =>
                setSelectedCoupon({ ...selectedCoupon, description: e.target.value })
              }
            />

            <label>Discount Value</label>
            <input
              type="number"
              value={selectedCoupon.discountValue}
              onChange={(e) =>
                setSelectedCoupon({
                  ...selectedCoupon,
                  discountValue: e.target.value,
                })
              }
            />

            <label>Status</label>
            <select
              value={selectedCoupon.active}
              onChange={(e) =>
                setSelectedCoupon({
                  ...selectedCoupon,
                  active: e.target.value === "true",
                })
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <button
              className="btn btn-primary mt-3 w-100"
              onClick={updateCoupon}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoupenEdit;
