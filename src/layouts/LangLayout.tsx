import { Outlet, useParams, Navigate } from "react-router-dom";

const SUPPORTED_LANGS = ["ru", "uz"];

const LangLayout = () => {
  const { lang } = useParams();

  // agar til mavjud bo‘lmasa yoki noto‘g‘ri bo‘lsa — default tilga o‘tkazish
  if (!SUPPORTED_LANGS.includes(lang)) {
    return <Navigate to="/uz" replace />;
  }

  // bu yerda i18n yoki context orqali tilni o‘rnatish mumkin
  // i18n.changeLanguage(lang)

  return (
      <Outlet />
  );
};

export default LangLayout;
