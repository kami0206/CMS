import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/layout/dasboardlayout";
import OverviewPage from "@/pages/overview/overviewpage";
import StaffPage from "@/pages/staff/staffpage";
import CustomersPage from "@/pages/customers/customerspage";
import OrdersPage from "@/pages/oder/orderpage";
import WarehousePage from "@/pages/warehouse/warehousepage";
import DeliveryPage from "@/pages/delivery/deliverypage";
import FinanceReportPage from "@/pages/finance/report";
import FinanceDetailPage from "@/pages/finance/detail";
import PromotionPage from "@/pages/promotion/promotionpage";
import NotificationPage from "@/pages/notification/notificationpage";
import Category1Page from "@/pages/category/categorypage1";
import Category2Page from "@/pages/category/categorypage2";
import LoginPage from "@/pages/Login/loginpage";
import useAuthStore from "@/store/userstore";

const AppRouter: React.FC = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <Router>
      <Routes>
        {/* Trang login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Các route chính */}
        <Route
          path="/"
          element={
            accessToken ? (
              <DashboardLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="order" element={<OrdersPage />} />
          <Route path="warehouse" element={<WarehousePage />} />
          <Route path="delivery" element={<DeliveryPage />} />
          <Route path="finance/report" element={<FinanceReportPage />} />
          <Route path="finance/detail" element={<FinanceDetailPage />} />
          <Route path="promotion" element={<PromotionPage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="category/1" element={<Category1Page />} />
          <Route path="category/2" element={<Category2Page />} />
        </Route>

        {/* fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
