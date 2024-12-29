"use client";

import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductBannerProps, ProductCategoryProps } from "@/types";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueries } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { useTranslation } from "react-i18next";

const HomeSlider = () => {
  const {i18n} = useTranslation()
  const axiosPrivate = useAxios();
  const [getBannerProductsQuery, getCategoryProductsQuery] = useQueries({
    queries: [
      {
        queryKey: ["bannerquery"],
        queryFn: async () => {
          const { data } = await axiosPrivate.get("/banners");
          return data && data.data;
        },
        enabled: true,
        retry: false,
      },
      {
        queryKey: ["categoryquery"],
        queryFn: async () => {
          const response = await axiosPrivate.get<ProductCategoryProps[]>(
            "/categorys"
          );
          return response && response.data;
        },
        enabled: true,
        retry: false,
      },
    ],
  });
  return (
    <div>
      {getBannerProductsQuery.isLoading || getBannerProductsQuery.isFetching ? (
        <div className="my-3">
          <Swiper
            slidesPerView={1.1}
            spaceBetween={10}
            centeredSlides={true}
            loop={true}
            className="mySwiper relative"
          >
            <SwiperSlide className=" rounded-[30px] overflow-hidden relative">
              <Skeleton className="w-full aspect-video" />
            </SwiperSlide>
            <SwiperSlide className=" rounded-[30px] overflow-hidden relative">
              <Skeleton className="w-full aspect-video" />
            </SwiperSlide>
          </Swiper>
        </div>
      ) : getBannerProductsQuery.data &&
        getBannerProductsQuery.data.length > 0 ? (
        <div className="my-3">
          <Swiper
            slidesPerView={1.1}
            spaceBetween={10}
            centeredSlides={true}
            loop={true}
            className="mySwiper relative"
          >
            {getBannerProductsQuery.data.map(
              (bannerItem: ProductBannerProps, index: number) => (
                <SwiperSlide
                  key={index}
                  className=" rounded-[30px] overflow-hidden relative"
                >
                 <Link to={bannerItem.link}>
                 <div className="cursor-pointer">
                    <div className="overlay"></div>
                    <img
                      src={bannerItem.image_path}
                      alt="images"
                      width={420}
                      height={420}
                      className="!object-contain opacity-100 mix-blend-multiply card-image duration-300 w-full"
                    />
                  </div>
                 </Link>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      ) : (
        <div>
          <Swiper
            slidesPerView={1.1}
            spaceBetween={10}
            centeredSlides={true}
            // loop={data?.bannerData.length > 2 && true}
            className="mySwiper relative"
          >
            <SwiperSlide className=" rounded-[30px] overflow-hidden relative">
              <Skeleton />
            </SwiperSlide>
          </Swiper>
        </div>
      )}
      {getCategoryProductsQuery.isFetching &&
      getCategoryProductsQuery.isLoading ? (
        <div className="w-full border-b-8 pb-2">
          <Swiper
            simulateTouch={false}
            allowTouchMove={false}
            touchStartPreventDefault={false}
            slidesPerView={"auto"}
            spaceBetween={10}
            freeMode={true}
            modules={[FreeMode]}
            className="mySwiper !w-full !px-3"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <SwiperSlide key={i + "categorySlider"} className="!w-16 p-2">
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="w-full aspect-square" />
                  <Skeleton className="w-[120%] flex h-2" />
                  <Skeleton className="w-2/3 flex h-2" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : getCategoryProductsQuery.data &&
        getCategoryProductsQuery.data.length > 0 ? (
        <div className="w-full border-b-8 pb-2">
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={0}
            freeMode={true}
            modules={[FreeMode]}
            className="mySwiper !w-full !px-3"
          >
            {getCategoryProductsQuery.data.map((categoryItem, index) => (
              <SwiperSlide key={index} className="!w-20">
                <div
                  className="!w-20 cursor-pointer"
                >
                  <Link to={`/catalog/category/${categoryItem.id}`} className="flex flex-col items-center">
                    <div className="rounded-[14px] w-14 aspect-square overflow-hidden relative m-1">
                      <div className="overlay"></div>
                      <img
                        src={categoryItem.image_path}
                        alt="images"
                        width={56}
                        height={56}
                        className="!object-contain opacity-100 mix-blend-multiply card-image duration-300"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-center line-clamp-2 font-mono">
                        {categoryItem[`name_${i18n.language}`]}
                      </p>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default HomeSlider;
