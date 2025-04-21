
// src/antd-compat.ts
import "@ant-design/v5-patch-for-react-19";
import "antd/dist/reset.css";
import ThemeProvider from "@/context/theme/themecontext";
import AppRoutes from "./router/AppRouter";

function App() {
  return (
    <ThemeProvider>
      <AppRoutes/>
    </ThemeProvider>
  );
}

export default App;
