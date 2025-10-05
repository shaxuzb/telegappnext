import { Root } from "@/components/Root";
import i18n from "@/config/i18n";
import { Outlet, useParams, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SUPPORTED_LANGS = ["ru", "uz"];

const LangLayout = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const storedLang = localStorage.getItem("lang");

  // 1️⃣ URL yo‘q yoki noto‘g‘ri bo‘lsa — localStoragedan yoki default tildan foydalanamiz
  if (!lang || !SUPPORTED_LANGS.includes(lang)) {
    const redirectLang =
      storedLang && SUPPORTED_LANGS.includes(storedLang)
        ? storedLang
        : "uz";
    return <Navigate to={`/${redirectLang}`} replace />;
  }

  // 2️⃣ i18n tilni yangilash
  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem("lang", lang);
    }
  }, [lang]);

  // 3️⃣ Agar localStoragedagi til o‘zgarsa — sahifani qayta yo‘naltirish (reloadsiz)
  useEffect(() => {
    const handleLangChange = (e: StorageEvent) => {
      if (e.key === "lang" && e.newValue && e.newValue !== lang) {
        // URLni yangilaymiz, lekin foydalanuvchi o‘sha pageda qoladi
        const currentPath = window.location.pathname.split("/").slice(2).join("/");
        navigate(`/${e.newValue}/${currentPath}`, { replace: true });
      }
    };

    window.addEventListener("storage", handleLangChange);
    return () => window.removeEventListener("storage", handleLangChange);
  }, [lang, navigate]);

  return (
    <Root>
      <Outlet />
    </Root>
  );
};

export default LangLayout;
