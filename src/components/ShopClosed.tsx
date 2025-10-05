import shpCloles from "@/assets/images/shopclosed.png";
import { useEffect } from "react";
import { TelegPage } from "./TelegPage";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
const ShopClosed = () => {
  const { t } = useTranslation();
  const user = JSON.parse(sessionStorage.getItem("user"));
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
      <div className="flex flex-col-reverse items-center justify-between h-[100vh] pt-6">
        <div>
          <img src={shpCloles} loading="lazy" alt="notFound" />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-[#ef4444] text-2xl font-semibold">
            {t("errors.closed.title")}
          </h1>
          <p className="text-[hsl(236,14%,39%)] text-center px-3 pb-5 pt-2 text-sm">
            {t("errors.closed.desc", {
              startTime: user.open,
              finishTime: user.close,
            })}
          </p>
          <Button variant="destructive" onClick={handleClose}>
            {t("errors.closed.button")}
          </Button>
        </div>
      </div>
    </TelegPage>
  );
};

export default ShopClosed;
