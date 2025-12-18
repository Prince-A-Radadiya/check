import { Navigate } from "react-router-dom";

const AdminProtected = ({ children }) => {
  const token = localStorage.getItem("token"); 
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/Account" replace />;
  }

  return children;
};

export default AdminProtected;
