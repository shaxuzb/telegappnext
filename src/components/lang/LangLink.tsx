import { Link, useParams } from "react-router-dom";

export default function LangLink({ to = "", ...props }) {
  const { lang } = useParams();
  const normalizedPath =
    to.startsWith("/") ? to : `/${to}`; // kerak bo‘lsa boshida / qo‘shadi
  return <Link to={`/${lang}${normalizedPath}`} {...props} />;
}
