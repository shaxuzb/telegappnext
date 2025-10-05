import React from "react";
import { useMatch } from "react-router-dom";
import LangLink from "../lang/LangLink";
interface LinksProps {
  path: string;
  icon: React.ReactNode;
  title: string;
}
const Links = (props: LinksProps) => {
  const { path, icon, title } = props;
  const matchLink = useMatch({
    path: `/${path}`,
    end: `/${path}`.length === 1,
  });
  return (
    <LangLink
      to={path}
      className={`flex flex-col items-center cursor-pointer gap-[2px] ${
        matchLink ? "text-ring" : "text-[#A8ABB4]"
      } `}
    >
      {icon}
      <span className={`text-[12px]`}>{title}</span>
    </LangLink>
  );
};

export default Links;
