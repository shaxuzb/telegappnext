import React from "react";
import { Link, useMatch } from "react-router-dom";
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
    <Link
      to={path}
      className={`flex flex-col items-center cursor-pointer gap-[2px] ${
        matchLink ? "text-ring" : "text-[#A8ABB4]"
      } `}
    >
      {icon}
      <span className={`text-[12px]`}>{title}</span>
    </Link>
  );
};

export default Links;
