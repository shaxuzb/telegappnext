import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import StoreProvider from "./StoreProvider.tsx";
import "@/config/i18n"
createRoot(document.getElementById("root")!).render(
  <StoreProvider>
    <App />
  </StoreProvider>
);
