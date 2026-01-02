import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

import {
  FaUsers, FaShoppingCart, FaDollarSign, FaExclamationTriangle, FaCog
} from "react-icons/fa";
import { BsHourglassSplit } from "react-icons/bs";
import Sidebar from "../../Component/Sidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,   // 🔥 REQUIRED FOR DOUGHNUT
  Tooltip,
  Filler,
  Legend
);

const ORDER_STATUS_COLORS = {
  pending: "#6c757d",    // grey
  confirmed: "#3b82f6",  // blue
  shipped: "#facc15",    // yellow
  delivered: "#22c55e",  // green
  cancelled: "#ef4444",  // red
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalUsers: 0,
    lowStock: 0,
  });
  const [orderStatus, setOrderStatus] = useState([]);
  const [salesChart, setSalesChart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));

  // Generate all dates between from and to
  const generateDateRange = (start, end) => {
    const dates = [];
    let current = dayjs(start);
    while (current.isBefore(end) || current.isSame(end)) {
      dates.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }
    return dates;
  };

  const ringData = {
    labels: orderStatus.map(s => s._id),
    datasets: [
      {
        data: orderStatus.map(s => s.count),
        backgroundColor: orderStatus.map(
          s => ORDER_STATUS_COLORS[s._id] || "#000000"
        ),
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          `http://localhost:9000/dashboard?from=${fromDate}&to=${toDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStats(res.data.stats);
        setOrderStatus(res.data.status);

        // ===== SALES CHART =====
        const salesMap = {};
        res.data.sales.forEach(s => { salesMap[s._id] = s.amount; });

        const allDates = generateDateRange(fromDate, toDate);

        setSalesChart({
          labels: allDates.map(d => dayjs(d).format("DD MMM")),
          datasets: [
            {
              label: "Revenue",
              data: allDates.map(d => salesMap[d] || 0),
              fill: true,
              borderColor: "#6366f1",
              backgroundColor: (ctx) => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
                gradient.addColorStop(0, "rgba(99,102,241,0.35)");
                gradient.addColorStop(1, "rgba(99,102,241,0)");
                return gradient;
              },
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "#6366f1",
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [fromDate, toDate]);

  const totalOrdersCount = orderStatus.reduce((a, b) => a + b.count, 0);
  const getPercent = (count) => totalOrdersCount ? Math.round((count / totalOrdersCount) * 100) : 0;

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#6b7280" }, grid: { display: false } },
      y: { ticks: { color: "#6b7280" }, grid: { color: "#e5e7eb" } }
    }
  };

  if (loading) return <div className="admin d-flex"><Sidebar /><div className="admin-content p-4">Loading dashboard...</div></div>;

  return (
    <div className="admin d-flex">
      <Sidebar />
      <div className="admin-content p-4 fade-in">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Dashboard</h2>
          <div className="d-flex align-items-center gap-3">
            <FaCog className="fs-5 cursor-pointer text-muted" />
            <img src={require("../../Img/admin.webp")} alt="Admin" className="admin-avatar" />
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="row g-4 mb-4">
          <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={<FaDollarSign />} color="success" />
          <StatCard title="Total Orders" value={stats.totalOrders} icon={<FaShoppingCart />} color="primary" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} icon={<BsHourglassSplit />} color="warning" />
          <StatCard title="Total Users" value={stats.totalUsers} icon={<FaUsers />} color="success" />
          <StatCard title="Low Stock" value={stats.lowStock} icon={<FaExclamationTriangle />} color="danger" />
        </div>

        {/* SALES + STATUS */}
        <div className="row g-4 mb-4">
          {/* SALES */}
          <div className="col-lg-8">
            <div className="card dashboard-card h-100">
              <div className="card-header bg-transparent border-0">
                <h5 className="mb-1">Sales Overview</h5>
                <div className="d-flex gap-2">
                  <input type="date" className="form-control form-control-sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                  <input type="date" className="form-control form-control-sm" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
              </div>
              <div className="card-body" style={{ height: 280 }}>
                {salesChart && <Line data={salesChart} options={salesOptions} />}
              </div>
            </div>
          </div>

          {/* ORDER STATUS */}
          <div className="col-lg-4">
            <div className="card dashboard-card h-100">
              <div className="card-header bg-transparent border-0"><h5>Order Status</h5></div>
              <div className="card-body text-center">
                <div style={{ position: "relative", width: 220, height: 220 }}>
                  <Doughnut key={orderStatus.map(s => s.count).join("-")} data={ringData} />
                  <div
                    style={{
                      position: "absolute",
                      top: "60%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: 24,
                      fontWeight: 700,
                    }}
                  >
                    {stats.totalOrders}
                  </div>
                </div>

                <ul className="list-unstyled text-start small mt-3">
                  {orderStatus.map((s) => (
                    <li key={s._id} className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: ORDER_STATUS_COLORS[s._id],
                          display: "inline-block",
                        }}
                      ></span>
                      {s._id} — {getPercent(s.count)}%
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="col-xl-2 col-lg-4 col-md-6">
    <div className="card dashboard-card">
      <div className="card-body d-flex justify-content-between">
        <div><p className="text-muted mb-1">{title}</p><h5 className="mb-0">{value}</h5></div>
        <div className={`icon-box text-${color} d-flex mt-1`}>{icon}</div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
