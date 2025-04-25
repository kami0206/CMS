import React from "react";
import { Layout } from "antd";
import { Sidebar, Topbar } from "@/components/sidebar";
import { Outlet } from "react-router-dom";
const DashboardLayout: React.FC = () => {
  const title = "Nhân viên";
  return (
    <Layout className="h-auto">
      <Sidebar />
      <Layout>
        <Topbar title={title} />
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
