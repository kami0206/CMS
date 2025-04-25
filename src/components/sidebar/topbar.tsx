import React from "react";
import { Layout, Badge, Avatar, Dropdown, MenuProps } from "antd";
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
  const language = LanguageStore((state) => state.language);
  const setLanguage = LanguageStore((state) => state.setLanguage);

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logoutUser = useAuthStore((state) => state.logoutUser);

  // Language options
  const languageItems: MenuProps["items"] = [
    {
      key: "vi",
      label: (
        <div className="flex items-center gap-2">
          <img
            src="https://flagcdn.com/w40/vn.png"
            alt="Vietnam Flag"
            className="w-5 h-5 object-cover rounded-sm"
          />
          Tiếng Việt
        </div>
      ),
    },
    {
      key: "en",
      label: (
        <div className="flex items-center gap-2">
          <img
            src="https://flagcdn.com/w40/us.png"
            alt="US Flag"
            className="w-5 h-5 object-cover rounded-sm"
          />
          English
        </div>
      ),
    },
  ];

  const handleLanguageChange: MenuProps["onClick"] = (info) => {
    setLanguage(info.key as "vi" | "en");
  };

  // User menu items
  const userItems: MenuProps["items"] = [
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: logoutUser,
    },
  ];

  return (
    <Header className="flex items-center justify-between bg-white shadow-md px-4">
      {/* Left Section */}
      <h4 className="text-lg font-medium">{title}</h4>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Language Dropdown */}
        <Dropdown
          menu={{ items: languageItems, onClick: handleLanguageChange }}
          trigger={["click"]}
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

        {/* Notification Bell */}
        <Badge count={99} overflowCount={99} offset={[0, 5]}>
          <BellOutlined className="text-xl text-gray-700 cursor-pointer" />
        </Badge>

        {/* User Avatar Dropdown */}
        <Dropdown menu={{ items: userItems }} trigger={["click"]}>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar
              src={user?.avatar || "https://i.pravatar.cc/300"}
              alt="User Avatar"
            />
            <span className="text-gray-700 font-medium">
              {token ? user?.name || "Người dùng" : "Khách"}
            </span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Topbar;
