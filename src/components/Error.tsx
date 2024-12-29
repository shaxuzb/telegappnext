import error from "@/assets/images/error.webp";
import { useEffect } from "react";
import { TelegPage } from "./TelegPage";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
const Error = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.body.classList.remove("pt-14");
    return () => {
      document.body.classList.add("pt-14");
    };
  }, []);
  const handleClose = () => {
    if (window.Telegram) {
      window.Telegram.WebApp.close();
    }
  };
  return (
    <TelegPage back={false}>
      <div className="flex flex-col items-center justify-between h-[calc(70vh)]">
        <div>
          <img src={error} loading="lazy" alt="notFound" />
        </div>
        <div className="flex flex-col gap-0 items-center">
          <h1 className="text-2xl text-[#ef4444] font-semibold">
          {t("errors.error.title")}
          </h1>
          <p className="text-center pb-5 px-3 text-[hsl(236,14%,39%)] ">
          {t("errors.error.desc")}
          </p>
          <Button variant="destructive" onClick={handleClose}>{t("errors.error.button")}</Button>
        </div>
      </div>
    </TelegPage>
  );
};

export default Error;
