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
      //"query_id=AAFZoBktAAAAAFmgGS2eOc8z&user=%7B%22id%22%3A756654169%2C%22first_name%22%3A%22RICH%20BOY%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22richdev_1%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FnjRxp0dlTx43XaA-Qa5J64B_0d2RBcdsyMjigPcaZgE.svg%22%7D&auth_date=1734587435&signature=PfZi6xm8nv1wEsNAe5k3cjRaxYL84jv_sc4JiKZV7hkVjko3pJmIDDuYMJiT6X_JKNSnD6HsfC5QnY6fzFgGBw&hash=9e5a8ff4338b0efb0fab35714ee2aa567b1567320e918c654d9d2260901d910a"
      //window.Telegram.WebApp.initData
      const value = {
        initData: (window as any).Telegram.WebApp.initData,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        value,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.data) {
        if (response.data.status === "closed") {
          window.location.pathname = "/shop-closed";
          setTimeout(() => {
            setDidMount(true);
          }, 1000);
        } else if (response.data.status === "unregistered") {
          window.location.pathname = "/user-notfound";
          setTimeout(() => {
            setDidMount(true);
          }, 1000);
        } else if (response.data.status === "error") {
          window.location.pathname = "/error";
          setTimeout(() => {
            setDidMount(true);
          }, 1000);
        } else {
          sessionStorage.setItem("user", JSON.stringify(response.data));
          setTimeout(() => {
            setDidMount(true);
          }, 1000);
        }
        sessionStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (err) {
      setDidMount(true);
      console.error(err);
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
