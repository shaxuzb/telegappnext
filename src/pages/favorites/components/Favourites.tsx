import ProductCard from "@/components/cards/ProductCard";
import { Button } from "@/components/ui/button";
import { hydrateFavourites } from "@/store/features/favouriteSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Favourites: React.FC = () => {
  const {t} = useTranslation()  
  const favourites = useAppSelector(state => state.favourites)
  const dispatch = useAppDispatch();
  useEffect(() => {
    const favouritesStorage = JSON.parse(localStorage.getItem("favourites"));
    dispatch(hydrateFavourites(favouritesStorage));
  }, [localStorage.getItem("favourites")]);
  const navigate = useNavigate();
  return (
    <div className="px-5">
      {favourites && favourites.length > 0 ? (
        <div>
          <div>
            <h1 className="font-medium text-[20px] pb-4">{t("pages.favorite.myFavorite")}</h1>
          </div>
          <ProductCard productSaleData={favourites} />
        </div>
      ) : (
        <div className="flex justify-center items-start py-2">
          <div className="flex flex-col items-center justify-center">
            <img
              src="https://uzum.uz/static/img/hearts.cf414be.png"
              alt="No favourite"
              width={120}
              height={120}
            />
            <h1 className="text-xl font-medium font-mono my-2">
             {t("pages.favorite.notFoundh1")}
            </h1>
            <p className="text-[12px] text-[#1f2026]">
            {t("pages.favorite.notFoundP")}
            </p>

            <Button
              className="mt-6"
              onClick={() => {
                navigate("/");
              }}
            >
              {t("navbar.home")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourites;
