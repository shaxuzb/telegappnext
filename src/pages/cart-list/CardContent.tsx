import React, { useEffect } from "react";
import { numberSpacing } from "@/lib/utils";
import ProdcutCardList from "@/components/cards/ProdcutCardList";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateCardList } from "@/store/features/cartListSlice";
import { useTranslation } from "react-i18next";
import useLangNavigate from "@/hooks/useLangNavigate";
import LangLink from "@/components/lang/LangLink";

const CardContent: React.FC = () => {
  const {t} = useTranslation()
  const cartListStorage = useAppSelector(state => state.cartList)
  const dispatch = useAppDispatch()
  useEffect(()=>{
    const cartListStorages = JSON.parse(
      localStorage.getItem("cart-list")
    );
    dispatch(hydrateCardList(cartListStorages))
  },[])
  const totalAmount = () => {
    return (
      cartListStorage.reduce(
        (arr, cerr) =>
          arr +
          (cerr.discount ? cerr.price - cerr.discount : cerr.price) *
            cerr.quantity,
        0
      ) ?? 0
    );
  };
  const navigate = useLangNavigate();
  return (
    <div>
      {cartListStorage && cartListStorage.length > 0 ? (
        <div className="mt-4">
          <h1 className="font-medium font-mono text-lg px-3">
            {t("navbar.cartList")},{" "}
            <span className="font-normal text-[#A8ABB4]">
              {cartListStorage.length} {t("profile.product")}
            </span>
          </h1>
          <ProdcutCardList cardListData={cartListStorage} />
        </div>
      ) : (
        <div className="flex justify-center items-start py-2">
          <div className="flex flex-col items-center justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/13637/13637462.png"
              alt="No list"
              width={120}
              height={120}
            />
            <h1 className="text-xl font-medium font-mono my-2 text-center">
            {t("pages.cartList.notFoundh1")}
            </h1>
            <p className="text-[12px] text-[#1f2026] text-center px-6">
            {t("pages.cartList.notFoundP")}
            </p>

            <Button
              className="mt-6 bg-chart-4 text-black"
              onClick={() => {
                navigate("/");
              }}
            >
               {t("navbar.home")}
            </Button>
          </div>
        </div>
      )}
      {cartListStorage && cartListStorage.length > 0 && (
        <div className="fixed bottom-[54px] border-b w-full flex justify-between bg-white z-10 card-price-send items-center px-3 py-2 max-w-[500px]">
          <div className="flex flex-col leading-[10px] gap-[2px]">
            <p className="text-[10px] text-[#4d4f59]">{t("profile.orderYour")}</p>
            <p className="font-medium font text-base leading-4">
              {numberSpacing(totalAmount())} {t("common.currency")}
            </p>
          </div>
          <div>
            <LangLink to={"/checkout"}>
              <Button>{t("pages.cartList.orderCreate")}</Button>
            </LangLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardContent;
