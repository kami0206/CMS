import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  CarOutlined,
  DollarOutlined,
  NotificationOutlined,
  AppstoreOutlined,
  RightOutlined,
} from "@ant-design/icons";


import { NavLink, useLocation } from "react-router-dom";
import useAuthStore from "@/store/userstore";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { userName } = useAuthStore();
  const initials = userName
  ?.split(" ")
  .map(word => word.charAt(0).toUpperCase())
  .join("") || "U";
  // Tạo menu items có hỗ trợ NavLink
  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: <NavLink to="/">Tổng quan</NavLink>,
    },
  
    {
      key: "/staff",
      icon: <UserOutlined />,
      label: <NavLink to="/staff">Nhân viên</NavLink>,
    },
    {
      key: "/customers",
      icon: <TeamOutlined />,
      label: <NavLink to="/customers">Khách hàng</NavLink>,
    },
    {
      key: "/order",
      icon: <ShoppingCartOutlined />,
      label: <NavLink to="/order">Đơn hàng</NavLink>,
    },
    {
      key: "/warehouse",
      icon: <HomeOutlined />,
      label: <NavLink to="/warehouse">Kho hàng</NavLink>,
    },
    {
      key: "/delivery",
      icon: <CarOutlined />,
      label: <NavLink to="/delivery">Đơn vận</NavLink>,
    },
    {
      key: "finance",
      icon: <DollarOutlined />,
      label: "Tài chính",
      children: [
        {
          key: "/finance/report",
          label: <NavLink to="/finance/report">Báo cáo</NavLink>,
        },
        {
          key: "/finance/detail",
          label: <NavLink to="/finance/detail">Chi tiết</NavLink>,
        },
      ],
    },
    {
      key: "/promotion",
      icon: <AppstoreOutlined />,
      label: <NavLink to="/promotion">Khuyến mại</NavLink>,
    },
    {
      key: "/notification",
      icon: <NotificationOutlined />,
      label: <NavLink to="/notification">Thông báo</NavLink>,
    },
    {
      key: "category",
      icon: <AppstoreOutlined />,
      label: "Danh mục",
      children: [
        {
          key: "/category/1",
          label: <NavLink to="/category/1">Danh mục 1</NavLink>,
        },
        {
          key: "/category/2",
          label: <NavLink to="/category/2">Danh mục 2</NavLink>,
        },
      ],
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className=" h-screen bg-white shadow-lg"
    >
      {/* Logo */}
      <div className="relative flex h-15 w-full items-center justify-center bg-white transition-all duration-500">
        <h4 className="text-primary text-xl font-semibold flex items-center gap-2">
          {!collapsed && <AppstoreOutlined className="text-primary" />}
          {collapsed ? initials : userName || "User"}
        </h4>
        <div className="absolute right-0 translate-x-1/2">
          <Button size="small" onClick={() => setCollapsed(!collapsed)}>
            <RightOutlined
              className={`text-primary transition-transform duration-500 ${
                collapsed ? "" : "rotate-180"
              }`}
            />
          </Button>
        </div>
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[location.pathname]} // Hiển thị mục đang active
        defaultOpenKeys={["finance", "category"]} // Mở rộng menu con
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
