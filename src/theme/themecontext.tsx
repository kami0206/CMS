import React from "react";
import { ConfigProvider } from "antd";

interface ThemeContextProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeContextProps> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#d34127",
          colorLink: "#1890ff", 
          fontFamily: 'Roboto',
        },
        components: {
            Layout: {
              siderBg: '#fff',
              headerBg: '#fff',
              headerHeight: 48,
              headerPadding: '0 12px 0 24px',
              bodyBg: '#f5f5f5',
  
              footerBg: '#fff',
              footerPadding: '12px 8px',
            },
            Menu: {
              itemSelectedBg: '#f8d4ce',
              itemBg: '#fff',
            },
          },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;