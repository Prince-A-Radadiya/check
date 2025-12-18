import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    DashboardOutlined,
    TeamOutlined,
    CarOutlined,
    PlusSquareOutlined,
    CalendarOutlined,
    MailOutlined,
    SettingOutlined,
    StarOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import { Button, Menu } from "antd";

const items = [
    { key: "/Admin-dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/Admin-dashboard/users", icon: <TeamOutlined />, label: "Users" },
    { key: "/Admin-dashboard/manage-cars", icon: <CarOutlined />, label: "Manage Cars" },
    { key: "/Admin-dashboard/add-car", icon: <PlusSquareOutlined />, label: "Add New Car" },
    { key: "/Admin-dashboard/bookings", icon: <CalendarOutlined />, label: "Bookings" },
    { key: "/Admin-dashboard/contact-message", icon: <MailOutlined />, label: "Contact Message" },
    { key: "/Admin-dashboard/settings", icon: <SettingOutlined />, label: "Settings" },
    { key: "/Admin-dashboard/reviews", icon: <StarOutlined />, label: "Reviews" }
];

const Sidebar = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => setCollapsed(!collapsed);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
    };

    return (
        <div style={{ minHeight: "100vh", width: collapsed ? 80 : 250, display: "flex", flexDirection: "column", background: "#001529" }}>
            
            <div style={{ padding: 16 }}>
                <Button type="primary" onClick={toggleCollapsed} style={{ width: "100%" }}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
            </div>

            <Menu
                onClick={(e) => navigate(e.key)}
                theme="dark"
                mode="inline"
                inlineCollapsed={collapsed}
                items={items}
                style={{ flex: 1 }}
            />

            <div style={{ padding: 16 }}>
                <Button danger type="primary" icon={<LogoutOutlined />} onClick={handleLogout} style={{ width: "100%" }}>
                    {!collapsed && "Logout"}
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
