import Navbar from "@/components/navbar";
import SearchBar from "@/components/search-bar/SearchBar";
import i18n from "@/config/i18n";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();
  const { lang } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);
  if (!["uz", "ru"].includes(lang)) return <Navigate to="/uz" replace />;
  return (
    <>
      {/* <ProgressBarLoading /> */}
      {/* <PaymentDialog /> */}
      <SearchBar />
      <Navbar />
      <Outlet />
    </>
  );
};

export default MainLayout;
