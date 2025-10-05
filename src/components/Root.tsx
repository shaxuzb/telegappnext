import { useNavigate, useParams } from "react-router-dom";
import { type PropsWithChildren, useEffect, useState } from "react";
import { ErrorBoundary } from "../ErrorBoundary.tsx";
import { ErrorPage } from "../ErrorPage.tsx";
import { useClientOnce } from "@/hooks/useClientOnce.tsx";
import { init } from "@/core/init";
import axios from "axios";
import { init as initSDK } from "@telegram-apps/sdk";
import { useTranslation } from "react-i18next";

export function Root({ children }: PropsWithChildren) {
  const [didMount, setDidMount] = useState<boolean>(false);
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    if (!localStorage.getItem("cart-list")) {
      localStorage.setItem("cart-list", JSON.stringify([]));
    }
    if (!localStorage.getItem("favourites")) {
      localStorage.setItem("favourites", JSON.stringify([]));
    }
  }, []);

  const sendUserData = async () => {
    try {
      const value = {
        initData: (window as any).Telegram.WebApp.initData,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        value,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      if (response.data) {
        const status = response.data.status;

        if (status === "closed") {
          navigate(`/${lang || "uz"}/shop-closed`, { replace: true });
        } else if (status === "unregistered") {
          navigate(`/${lang || "uz"}/user-notfound`, { replace: true });
        } else if (status === "error") {
          navigate(`/${lang || "uz"}/error`, { replace: true });
        } else {
          sessionStorage.setItem("user", JSON.stringify(response.data));
        }

        setTimeout(() => setDidMount(true), 500);
      }
    } catch (err) {
      console.error(err);
      setDidMount(true);
    }
  };

  useClientOnce(() => {
    init(true);
  });

  useEffect(() => {
    initSDK();
    sendUserData();
  }, []);

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>{children}</ErrorBoundary>
  ) : (
    <div className="root__loading flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <div>
          <span className="loader !border-ring"></span>
        </div>
        <div className="flex flex-col items-center mt-5">
          <h1 className="text-2xl">{t("loadingGetData.title")}</h1>
          <p>{t("loadingGetData.description")}</p>
        </div>
      </div>
    </div>
  );
}
