import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { ProductSaleProps } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { numberSpacing } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateFavourites, setAddFavourite, setRemoveFavourite } from "@/store/features/favouriteSlice";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
interface ProductCardProps {
  productSaleData: [] | ProductSaleProps[];
  setModal: (e: boolean)=> void
}
const SearchBarCard: React.FC<ProductCardProps> = ({ productSaleData,setModal }) => {
  const {t} = useTranslation()
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((state) => state.favourites);
  useEffect(() => {
    const storedFavourites: ProductSaleProps[] = JSON.parse(
      localStorage.getItem("favourites") || "[]"
    );
    dispatch(hydrateFavourites(storedFavourites));
  }, [dispatch]);

  const handleAdd = (item: ProductSaleProps, code: string) => {
    if (code === "favourite") {
      dispatch(setAddFavourite(item));
    }
  };

  const handleRemove = (item: ProductSaleProps, code: string) => {
    if (code === "favourite") {
      dispatch(setRemoveFavourite(item));
    }
  };

  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-5 mt-2">
      {productSaleData.map((productSaleItem: ProductSaleProps) => (
        <div className="relative" key={productSaleItem.id}>
          <div className="absolute top-2 right-2 z-[1] text-[#b6b2b2] duration-300 cursor-pointer animation_child_favourite">
            {favourites.find((item) => item.id === productSaleItem.id) ? (
              <div
                onClick={() => {
                  handleRemove(productSaleItem, "favourite");
                }}
                className="text-ring animation_child_favourite_checked"
              >
                <FaHeart fontSize={15} />
              </div>
            ) : (
              <div
                onClick={() => {
                  handleAdd(productSaleItem, "favourite");
                }}
                className="animation_child_favourite_unchecked"
              >
                <FaRegHeart fontSize={15} />
              </div>
            )}
          </div>
          <Link to={`/product/${productSaleItem.id}`} 
            onClick={()=>{
                setModal(false)
            }}
          >
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
                  className="mySwiper !w-full rounded-[20px] aspect-square overflow-hidden relative"
                >
                  {productSaleItem.images.filter(item => !item.is_video).map((itemImages) => (
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
                  <div className="absolute w-full bottom-0 flex justify-end pr-5 pb-4">
                    <div className="swiper-pagination !relative"></div>
                  </div>
                </Swiper>
              </div>
              <div>
                <div className="mt-2 line-clamp-2 overflow-hidden text-ellipsis">
                  <p className="text-xs h-8 line-clamp-2 overflow-hidden text-ellipsis font-mono pr-1">
                    {productSaleItem.name}
                  </p>
                </div>
                <div className="flex gap-3 mt-3">
                  <div className="flex gap-1 items-center justify-center">
                    <FaStar fontSize="15px" color="orange" />
                    <span className="text-sm font-mono">5.0</span>
                  </div>
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
                      UZS
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600 font-medium font-mono text-sm">
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

export default SearchBarCard;
