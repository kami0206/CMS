import React from "react";
import { Layout } from "antd";
import Sidebar from "@/components/sidebar/leftsidebar";
import BottomBar from "@/components/sidebar/botbar";
import { Topbar } from "@/components/sidebar";
import { Outlet } from 'react-router-dom';
const { Content } = Layout;
const DashboardLayout: React.FC = () => {
  const title = 'Nhân viên';
  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Topbar  title={title} />
        <Content>
          <Outlet />
        </Content>
        <BottomBar />
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
