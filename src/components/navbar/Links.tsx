import React from "react";
import { useLocation } from "react-router-dom";
import LangLink from "../lang/LangLink";

interface LinksProps {
  path: string;
  icon: React.ReactNode;
  title: string;
}

const Links = ({ path, icon, title }: LinksProps) => {
  const location = useLocation();

  // hozirgi URL dan tilni olib tashlaymiz (masalan /uz/home -> /home)
  const normalizedPath = location.pathname.replace(/^\/(uz|ru|en)/, "");

  const isActive = normalizedPath === `/${path}`;

  return (
    <LangLink
      to={path}
      className={`flex flex-col items-center cursor-pointer gap-[2px] ${
        isActive ? "text-ring" : "text-[#A8ABB4]"
      }`}
    >
      {icon}
      <span className="text-[12px]">{title}</span>
    </LangLink>
  );
};

export default Links;
