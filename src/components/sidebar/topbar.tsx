import React from "react";
import { Layout, Badge, Avatar, Dropdown, Menu } from "antd";
import {
  BellOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import LanguageStore from "@/store/langstore";
import useAuthStore from "@/store/userstore";

const { Header } = Layout;

type TopBarProps = {
  title: string;
};

const Topbar: React.FC<TopBarProps> = ({ title }) => {
  const { language, setLanguage } = LanguageStore(); // Get language state from LanguageStore
  const { userName, imgUrl, accessToken, logout } = useAuthStore(); // Destructure userName, imgUrl, and accessToken from useAuthStore

  // Handle language change
  const handleLanguageChange = (key: string) => {
    setLanguage(key === "1" ? "vi" : "en"); // Update language
  };

  // Language menu
  const languageMenu = (
    <Menu onClick={(e) => handleLanguageChange(e.key)}>
      <Menu.Item key="1">
        <div className="flex items-center gap-2">
          <img
            src="https://flagcdn.com/w40/vn.png"
            alt="Vietnam Flag"
            className="w-5 h-5 object-cover rounded-sm"
          />
          Tiếng Việt
        </div>
      </Menu.Item>
      <Menu.Item key="2">
        <div className="flex items-center gap-2">
          <img
            src="https://flagcdn.com/w40/us.png"
            alt="US Flag"
            className="w-5 h-5 object-cover rounded-sm"
          />
          English
        </div>
      </Menu.Item>
    </Menu>
  );

  // User menu
  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<SettingOutlined />}>
        Cài đặt
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<LogoutOutlined />}
        onClick={logout} // Call logout function
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="flex items-center justify-between bg-white shadow-md px-4">
      {/* Left Section */}
      <h4 className="text-lg font-medium">{title}</h4>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <Dropdown
          overlay={languageMenu}
          trigger={["click"]}
          overlayClassName="rounded-md shadow-md border border-gray-200 bg-white"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 bg-white cursor-pointer hover:border-gray-400 transition">
            <img
              src={
                language === "vi"
                  ? "https://flagcdn.com/w40/vn.png"
                  : "https://flagcdn.com/w40/us.png"
              }
              alt="Flag"
              className="w-5 h-5 object-cover rounded-sm"
            />
            <span className="text-sm text-gray-800 font-medium">
              {language === "vi" ? "Tiếng Việt" : "English"}
            </span>
            <DownOutlined className="text-gray-500 text-xs" />
          </div>
        </Dropdown>

        {/* Notification */}
        <Badge count={99} overflowCount={99} offset={[0, 5]}>
          <BellOutlined className="text-xl text-gray-700 cursor-pointer" />
        </Badge>

        {/* User Avatar Dropdown */}
        <Dropdown overlay={userMenu} trigger={["click"]}>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar
              src={imgUrl || "https://i.pravatar.cc/300"} // Use imgUrl from store or fallback to default
              alt="User Avatar"
              className="cursor-pointer"
            />
            <span className="text-gray-700 font-medium">
              {accessToken ? userName || "Người dùng" : "Khách"}{" "}
              {/* Display user's name if available */}
            </span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Topbar;
