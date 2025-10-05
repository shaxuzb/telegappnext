"use client";

import { FaCartShopping, FaList, FaRegHeart, FaRegUser } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import React, { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import Links from "./Links";
import { useTranslation } from "react-i18next";
interface NavsProps {
  title: string;
  path: string;
  icon: React.ReactNode;
  code: string;
}
const Navbar = () => {
  const {t} = useTranslation()
  const navBar = useAppSelector((state) => state.navBarHide);
  const favourites = useAppSelector((state) => state.favourites);
  const cartList = useAppSelector((state) => state.cartList);
  useEffect(() => {
    if (!navBar) {
      return document.body.classList.remove("pb-16");
    }
    document.body.classList.add("pb-14");
  }, [navBar]);
  const navs: NavsProps[] = [
    {
      title: t("navbar.home"),
      path: "/",
      icon: <FaHome className="text-[28px] favourite-icon" />,
      code: "home",
    },
    {
      title: t("navbar.katalog"),
      path: "catalog",
      icon: <FaList className="text-[28px] favourite-icon" />,
      code: "catalog",
    },
    {
      title: t("navbar.favorite"),
      path: "favorites",
      icon: <FaRegHeart className="text-[28px] favourite-icon" />,
      code: "favourite",
    },
    {
      title: t("navbar.cartList"),
      path: "cart-list",
      icon: <FaCartShopping className="text-[28px]" />,
      code: "cartlist",
    },
    {
      title: t("navbar.profile"),
      path: "profile",
      icon: <FaRegUser className="text-[26px]" />,
      code: "profile",
    },
  ];
  return (
    navBar && (
      <div
        className={`grid grid-cols-5 items-center w-full border-t-[1px] bg-white border-[#a8abb467] fixed bottom-0 pb-[2px] pt-[5px] z-10 max-w-[500px] m-auto`}
      >
        {navs.map((item, index) => (
          <div key={item.title || index} className="relative">
            {item.code === "favourite" && favourites.length > 0 && (
              <div className="absolute -top-1 left-[56px] text-[11px] bg-ring min-w-[16px] px-[2px] h-[16px] text-white flex justify-center items-center rounded-full">
                {favourites.length}
              </div>
            )}
            {item.code === "cartlist" && cartList.length > 0 && (
              <div className="absolute -top-1 left-[56px] text-[11px] bg-ring w-[16px] h-[16px] text-white flex justify-center items-center rounded-full">
                {cartList.length}
              </div>
            )}
            <Links path={item.path} icon={item.icon} title={item.title} />
          </div>
        ))}
      </div>
    )
  );
};

export default Navbar;
