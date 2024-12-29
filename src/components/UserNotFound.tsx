import accessDenied from "@/assets/images/authority.webp";
import { useEffect } from "react";
import { TelegPage } from "./TelegPage";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
const UserNotFound = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.body.classList.remove("pt-14");
    return () => {
      document.body.classList.add("pt-14");
    };
  }, []);
  return (
    <TelegPage back={false}>
      <div className="flex flex-col items-center justify-between h-[calc(70vh)]">
        <div>
          <img src={accessDenied} loading="lazy" alt="notFound" />
        </div>
        <div className="flex flex-col items-center px-5 text-center">
          <h1 className="text-[#ef4444] text-2xl font-semibold">
          {t("errors.unregistered.title")}
          </h1>
          <p className="text-[hsl(236,14%,39%)] text-center px-3 pb-5 pt-2 text-sm">
          {t("errors.unregistered.desc")}
          </p>
          <Link to={"https://t.me/vip_plastbot?start=restart"}>
            <Button variant="destructive">{t("errors.unregistered.button")}</Button>
          </Link>
        </div>
      </div>
    </TelegPage>
  );
};

export default UserNotFound;
