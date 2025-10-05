import i18n from "@/config/i18n";
import { Outlet, useParams, Navigate } from "react-router-dom";

const SUPPORTED_LANGS = ["ru", "uz"];

const LangLayout = () => {
  const { lang } = useParams();

  // LocalStorage'dan tilni olish
  const storedLang = localStorage.getItem("lang");

  // agar lang URL'da yo‘q yoki noto‘g‘ri bo‘lsa
  if (!lang || !SUPPORTED_LANGS.includes(lang)) {
    const redirectLang = storedLang && SUPPORTED_LANGS.includes(storedLang)
      ? storedLang
      : "uz"; // default til
    return <Navigate to={`/${redirectLang}`} replace />;
  }

  // i18n tilda ishlash uchun o‘rnatamiz
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang); // tanlangan tilni saqlash
  }

  return <Outlet />;
};

export default LangLayout;
