"use client";
import { numberSpacing } from "@/lib/utils";
import { ProductSaleInfoProps, ProductSaleProps, RatingTypes } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FaCartShopping,
  FaChevronRight,
  FaPause,
  FaPlay,
} from "react-icons/fa6";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { closest } from "color-2-name";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  hydrateCardList,
  setAddCartList,
} from "@/store/features/cartListSlice";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "react-i18next";
import { MdOutlineVolumeOff, MdOutlineVolumeUp } from "react-icons/md";
import { FreeMode } from "swiper/modules";
import Rating from "react-rating";
import { IoStar } from "react-icons/io5";
import LangLink from "@/components/lang/LangLink";
const ValidateCardList = z.object({
  size: z.string().min(1, { message: "common.validation.select" }),
  // sizePrice: z.number().min(1, { message: "Tanlang" }),
  color: z.string().min(1, { message: "common.validation.select" }),
});
interface ProductInfoProps {
  productInfoData: ProductSaleInfoProps;
  ratingDescInfo: {
    meta: {
      total_ratings: number;
    };
    data: RatingTypes[];
  };
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  productInfoData,
  ratingDescInfo,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const videoRef = useRef(null); // Reference to the video element
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVolume, setisVolume] = useState(false);
  const {
    watch,
    // setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof ValidateCardList>>({
    resolver: zodResolver(ValidateCardList),
    defaultValues: {
      size: "",
      // sizePrice: NaN,
      color: "",
    },
  });
  const dispatch = useAppDispatch();
  const cartListStorage = useAppSelector((state) => state.cartList);
  useEffect(() => {
    const storedCartList: ProductSaleProps[] = JSON.parse(
      localStorage.getItem("cart-list") || "[]"
    );
    dispatch(hydrateCardList(storedCartList));
  }, [dispatch]);
  const onSubmit: SubmitHandler<z.infer<typeof ValidateCardList>> = (data) => {
    dispatch(
      setAddCartList({
        ...productInfoData,
        price: productInfoData.sizes.find((item) => item.size === data.size)
          .size_price,
        size: data.size,
        color: data.color,
      })
    );
  };

  const handleAdd = () => {
    handleSubmit(onSubmit)();
  };
  const getDefaultPrice = () => {
    const findedSizePrice = productInfoData.sizes.find(
      (item) => item.size === watch().size
    );
    if (findedSizePrice) {
      return findedSizePrice.size_price;
    }
    return productInfoData.price;
  };
  const colorName = () => {
    const color = productInfoData.colors.filter(
      (item) => item.color_code === watch().color
    );
    const colorNamer = closest(color[0]?.color_code);

    return colorNamer.name ? colorNamer.name : "";
  };
  // useEffect(() => {
  //   const findedItem = cartListStorage.find(
  //     (item) =>
  //       item.id === productInfoData.id &&
  //       productInfoData.sizes.some((items) => items.size === item.size) &&
  //       productInfoData.colors.some((items) => items.color_code === item.color)
  //   );
  //   console.log(findedItem);

  //   if (findedItem) {
  //     setValue("color", findedItem.color);
  //     setValue("size", findedItem.size);
  //     setValue("sizePrice", findedItem.price);
  //   }
  // }, []);
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause(); // Pause the video
      } else {
        videoRef.current.play(); // Play the video
      }
      setIsPlaying(!isPlaying); // Toggle the state
    }
  };
  const toggleVolume = () => {
    if (videoRef.current) {
      if (isVolume) {
        videoRef.current.volume = 1; // Play the video
      } else {
        videoRef.current.volume = 0; // Pause the video
      }
      setisVolume(!isVolume); // Toggle the state
    }
  };
  return (
    <div>
      <div>
        <Swiper
          slidesPerView={1}
          centeredSlides={true}
          className="mySwiper relative bg-[#ececec]"
        >
          {productInfoData?.images.map((imagesItem, index) => (
            <SwiperSlide key={index} className="overflow-hidden relative">
              <div className="cursor-pointer w-full px-3 flex items-center justify-center">
                <div className="overlay"></div>
                {imagesItem.is_video ? (
                  <div className="w-full z-30 relative">
                    <video ref={videoRef} loop className="w-full z-30">
                      <source src={imagesItem.url} type="video/ogg" />
                    </video>
                    <Button
                      variant="secondary"
                      onClick={togglePlayPause}
                      className="p-0 rounded-full absolute bottom-2 left-2 h-8 w-8"
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={toggleVolume}
                      className="p-0 rounded-full absolute bottom-2 right-2 h-6 w-6"
                    >
                      {isVolume ? (
                        <MdOutlineVolumeOff />
                      ) : (
                        <MdOutlineVolumeUp />
                      )}
                    </Button>
                  </div>
                ) : (
                  <img
                    src={imagesItem.url}
                    alt="images"
                    width={420}
                    height={420}
                    className={`!object-contain opacity-100 mix-blend-multiply card-image duration-300 w-full ${
                      loading
                        ? "scale-110 blur-sm grayscale"
                        : "scale-100 blur-0 grayscale-0"
                    }`}
                    onLoad={() => setLoading(false)}
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="px-3 mt-3">
        <h1 className="text-xl font-mono font-medium">
          {productInfoData.name}
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 mt-4">
          {productInfoData.colors && productInfoData.colors.length > 0 && (
            <div className="px-3">
              <div>
                <p>
                  {errors.color?.message && (
                    <span className="text-red-600">
                      {t(errors.color?.message)}
                    </span>
                  )}{" "}
                  {t("common.color")}:{" "}
                  <span>{watch().color ? colorName() : ""}</span>
                </p>
              </div>
              <div className="flex gap-4">
                <Controller
                  name="color"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      value={value}
                      onValueChange={onChange}
                      className="flex"
                    >
                      {productInfoData.colors.map((item) => (
                        <Label
                          key={item.id}
                          style={{
                            borderColor:
                              watch().color === item.color_code ? "black" : "",
                          }}
                          className={`w-10 h-10 relative rounded-full border overflow-hidden cursor-pointer mt-2`}
                        >
                          <div
                            className={`overlay pointer-events-none`}
                            style={{ backgroundColor: item.color_code }}
                          ></div>
                          {item.image && (
                            <img
                              src={item.image}
                              alt="images"
                              width={420}
                              height={420}
                              className="!object-contain opacity-100 mix-blend-multiply card-image duration-300 w-full"
                            />
                          )}
                          <RadioGroupItem
                            className="absolute invisible pointer-events-none"
                            value={item.color_code}
                          />
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                />
              </div>
            </div>
          )}
          {productInfoData.sizes && productInfoData.sizes.length > 0 && (
            <div className="px-3">
              <div>
                <p>
                  {errors.size?.message && (
                    <span className="text-red-600">
                      {t(errors.size?.message)}
                    </span>
                  )}{" "}
                  {t("common.size")}:{" "}
                  <span>
                    {watch().size
                      ? productInfoData.sizes.filter(
                          (item) => item.size === watch().size
                        )[0].size
                      : ""}
                  </span>
                </p>
              </div>
              <div className="flex gap-4">
                <Controller
                  name="size"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      value={value}
                      onValueChange={onChange}
                      className="flex"
                    >
                      {productInfoData.sizes.map((item) => (
                        <Label
                          key={item.id}
                          className={`px-5 py-1 relative rounded-lg border cursor-pointer mt-2`}
                          style={{
                            borderColor:
                              watch().size === item.size ? "black" : "",
                          }}
                        >
                          {item.size}
                          <RadioGroupItem
                            className="absolute invisible pointer-events-none"
                            value={item.size}
                          />
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 items-start px-3 mt-3">
          <span className="font-medium font-mono text-2xl">
            {numberSpacing(
              productInfoData.discount
                ? getDefaultPrice() - productInfoData.discount
                : getDefaultPrice()
            )}{" "}
            {t("common.currency")}
          </span>
          {productInfoData.discount && (
            <div className={`flex gap-2 pt-[3px]`}>
              <span className="line-through text-[#b6b2b2] font-mono text-sm">
                {productInfoData.discount && numberSpacing(getDefaultPrice())}{" "}
                {t("common.currency")}
              </span>
              <span className="bg-yellow-300 rounded-lg px-1 flex items-center font-medium font-mono text-xs h-5">
                -
                {productInfoData.discount &&
                  (
                    (productInfoData.discount / getDefaultPrice()) *
                    100
                  ).toFixed(1)}
                %
              </span>
            </div>
          )}
        </div>
      </form>
      {ratingDescInfo && ratingDescInfo.data.length > 0 && (
        <div className="mt-3">
          <div className="flex justify-between px-3 items-center pb-2">
            <h1 className="font-medium text-lg font-mono">
              {t("description.countTitle", {
                count: ratingDescInfo.meta.total_ratings,
              })}
            </h1>
            <div>
              <LangLink
                to={`/product/review/${productInfoData.id}`}
                className="flex items-center gap-2 text-sm text-[#797979] font-normal font-mono cursor-pointer"
              >
                {t("common.viewAll")}
                <FaChevronRight fontSize={10} />
              </LangLink>
            </div>
          </div>
          <div className="ml-3">
            <Swiper
              slidesPerView="auto"
              freeMode={{ enabled: true, sticky: true }}
              spaceBetween={20}
              centeredSlides={true}
              grabCursor={true}
              modules={[FreeMode]}
              className="mySwiper !w-full"
            >
              {ratingDescInfo.data.map((item) => (
                <SwiperSlide
                  key={item.id}
                  className=" rounded-[20px] overflow-hidden relative border max-w-full h-[182px] p-3"
                >
                  <div>
                    <h1 className="font-semibold ">{item.user.name}</h1>
                    <div className="my-1">
                      <Rating
                        initialRating={+item.rating}
                        readonly
                        emptySymbol={<IoStar color="#DEE0E5" />}
                        fullSymbol={<IoStar color="#FFB54C" />}
                      />
                    </div>
                    <div>
                      <p className="text-sm line-clamp-6">
                        <span className="font-semibold ">
                          {t("profile.orders.cartOrder.comment.comm")}:{" "}
                        </span>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {productInfoData.info && productInfoData.info.length > 16 && (
        <div className="px-3 mt-3">
          <h1 className="text-xl font-mono font-medium">
            {t("common.description")}
          </h1>
          <div dangerouslySetInnerHTML={{ __html: productInfoData.info }}></div>
        </div>
      )}
      <div className="fixed bottom-0 w-full pb-3 flex justify-between bg-white z-[4] card-price-send items-center px-3 py-2 max-w-[500px]">
        <div className="flex flex-col leading-[10px] gap-[2px]">
          {cartListStorage.find(
            (item) =>
              item.id === productInfoData.id &&
              item.size === watch().size &&
              item.color === watch().color
          ) ? (
            <>
              <p className="text-[10px] text-[#4d4f59]">
                <span className="text-[#b6b2b2] font-mono text-xs">
                  {t("common.inCartList")}{" "}
                  {
                    cartListStorage.filter(
                      (item) =>
                        item.id === productInfoData.id &&
                        item.size === watch().size &&
                        item.color === watch().color
                    )[0].quantity
                  }{" "}
                  {t("common.amount")}
                </span>
              </p>
              <p className="font-medium font text-base leading-4">
                {numberSpacing(
                  (productInfoData.discount
                    ? getDefaultPrice() - productInfoData.discount
                    : productInfoData.price) *
                    cartListStorage.filter(
                      (item) => item.id === productInfoData.id
                    )[0].quantity
                )}{" "}
                {t("common.currency")}
              </p>
            </>
          ) : (
            <>
              <p className="text-[10px] text-[#4d4f59]">
                {" "}
                <span className="line-through text-[#b6b2b2] font-mono text-xs">
                  {productInfoData.discount && numberSpacing(getDefaultPrice())}{" "}
                  {t("common.currency")}
                </span>
              </p>
              <p className="font-medium font text-base leading-4">
                {numberSpacing(
                  productInfoData.discount
                    ? getDefaultPrice() - productInfoData.discount
                    : productInfoData.price
                )}{" "}
                {t("common.currency")}
              </p>
            </>
          )}
        </div>
        <div>
          {cartListStorage.find(
            (item) =>
              item.id === productInfoData.id &&
              item.size === watch().size &&
              item.color === watch().color
          ) ? (
            <div className="flex gap-3">
              <Button onClick={() => handleAdd()} className="py-0 px-3 h-8">
                +1
              </Button>
              <LangLink to={"/cart-list"}>
                <Button className="py-0 px-5 h-8 border border-ring bg-transparent text-ring hover:bg-secondary">
                  <FaCartShopping />
                  {t("common.toCartList")}
                </Button>
              </LangLink>
            </div>
          ) : (
            <Button onClick={() => handleAdd()} className="py-0 px-6 h-8">
              {t("common.toCartList")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
