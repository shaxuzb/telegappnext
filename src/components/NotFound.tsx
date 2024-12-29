import notFound from "@/assets/images/notFound.png";
import { useEffect } from "react";
import { TelegPage } from "./TelegPage";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
const NotFound = () => {
  const { t } = useTranslation();
  useEffect(() => {
    document.body.classList.remove("pt-14");
    return () => {
      document.body.classList.add("pt-14");
    };
  }, []);
  return (
    <TelegPage back={true}>
      <div className="flex flex-col items-center justify-between h-[calc(70vh)]">
        <div>
          <img src={notFound} loading="lazy" alt="notFound" />
        </div>
        <div className="flex flex-col gap-5 items-center">
          <h1 className="text-[hsl(236,14%,39%)] text-xl font-semibold">
            {t("pageNotFound")}
          </h1>
          <Link to={"/"}>
            <Button>{t("navbar.home")}</Button>
          </Link>
        </div>
      </div>
    </TelegPage>
  );
};

export default NotFound;
