"use client";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { ProductSaleProps } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { numberSpacing } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateFavourites, setAddFavourite, setRemoveFavourite } from "@/store/features/favouriteSlice";
import { hydrateCardList, setAddCartList } from "@/store/features/cartListSlice";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
interface ProductCardProps {
  productSaleData: [] | ProductSaleProps[];
}
const ProductCard: React.FC<ProductCardProps> = ({ productSaleData }) => {
  const {t} = useTranslation()
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((state) => state.favourites);
  useEffect(() => {
    const storedFavourites: ProductSaleProps[] = JSON.parse(
      localStorage.getItem("favourites") || "[]"
    );
    dispatch(hydrateFavourites(storedFavourites));

    const storedCartList: ProductSaleProps[] = JSON.parse(
      localStorage.getItem("cart-list") || "[]"
    );
    dispatch(hydrateCardList(storedCartList));
  }, [dispatch]);

  const handleAdd = (item: ProductSaleProps, code: string) => {
    if (code === "favourite") {
      dispatch(setAddFavourite(item));
    } else {
      dispatch(setAddCartList(item));
    }
  };

  const handleRemove = (item: ProductSaleProps, code: string) => {
    if (code === "favourite") {
      dispatch(setRemoveFavourite(item));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5">
      {productSaleData.map((productSaleItem:ProductSaleProps) => (
        <div className="relative" key={productSaleItem.id}>
          <div className="absolute top-4 right-4 z-[1] text-[#b6b2b2] duration-300 cursor-pointer animation_child_favourite">
            {favourites.find((item) => item.id === productSaleItem.id) ? (
              <div
                onClick={() => {
                  handleRemove(productSaleItem, "favourite");
                }}
                className="text-ring animation_child_favourite_checked"
              >
                <FaHeart fontSize={18} />
              </div>
            ) : (
              <div
                onClick={() => {
                  handleAdd(productSaleItem, "favourite");
                }}
                className="animation_child_favourite_unchecked"
              >
                <FaRegHeart fontSize={18} />
              </div>
            )}
          </div>
          <Link to={`/product/${productSaleItem.id}`}>
            <div
              className="w-full card duration-300 cursor-pointer hover:shadow-[0_10px_25px_-16px_#36374040]"
              title={productSaleItem.name}
            >
              <div className="relative">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={3}
                  pagination={{
                    el: ".swiper-pagination",
                    clickable: true,
                  }}
                  modules={[Pagination]}
                  className="mySwiper !w-full rounded-[30px] aspect-square overflow-hidden relative"
                >
                  {productSaleItem.images.filter(item => !item.is_video).map((itemImages) => (
                    !itemImages.is_video &&
                    <SwiperSlide key={itemImages.id} className="">
                      <div>
                        <div className="overlay"></div>
                        <img
                          src={itemImages.url}
                          alt="images"
                          className={`!object-contain object-center opacity-100 mix-blend-multiply card-image duration-300 inset-4
                           ${
                             loading
                               ? "scale-110 blur-sm grayscale"
                               : "scale-100 blur-0 grayscale-0"
                           } 
                          `}
                          onLoad={() => setLoading(false)}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                  <div className="absolute w-full bottom-0 z-50 flex justify-end pr-5 pb-4">
                    <div className="swiper-pagination !rounded-full !relative"></div>
                  </div>
                </Swiper>
              </div>
              <div>
                <div className="mt-2">
                  <p className="text-sm h-10 overflow-hidden line-clamp-2 font-mono pr-1">
                    {productSaleItem.name}
                  </p>
                </div>
                <div className="flex gap-3 mt-3">
                  <div className="flex gap-1 items-center justify-center">
                    <FaStar fontSize="15px" color="orange" />
                    <span className="text-sm font-mono">{productSaleItem.average_rating}</span>
                  </div>
                  <span className="font-normal text-sm font-mono">
                    {productSaleItem.seens} {t("common.shopCount")}
                  </span>
                </div>
                <div className="flex flex-col mt-3">
                  <div
                    className={`flex gap-2 ${
                      !productSaleItem.discount && "invisible"
                    }`}
                  >
                    <span className="line-through text-[#b6b2b2] font-mono text-xs">
                      {productSaleItem.discount &&
                        numberSpacing(productSaleItem.price)}{" "}
                       {t("common.currency")}
                    </span>
                    <span className="text-red-700 font-medium font-mono text-xs">
                      -
                      {productSaleItem.discount &&
                        (
                          ((productSaleItem.price - productSaleItem.discount) /
                            productSaleItem.price) *
                          100
                        ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600 font-medium font-mono text-base">
                      {numberSpacing(
                        productSaleItem.discount
                          ? productSaleItem.discount
                          : productSaleItem.price
                      )}{" "}
                      {t("common.currency")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
