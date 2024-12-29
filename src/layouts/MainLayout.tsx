import Navbar from "@/components/navbar";
import SearchBar from "@/components/search-bar/SearchBar";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation()
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[location])
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
