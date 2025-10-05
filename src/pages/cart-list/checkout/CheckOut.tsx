"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useAxios from "@/hooks/useAxios";
import { numberSpacing } from "@/lib/utils";
import { hydrateCardList } from "@/store/features/cartListSlice";
import { setHideNav } from "@/store/features/navbarBarSlice";
import { setHideSearch } from "@/store/features/searchBarSlice";
import { useAppSelector } from "@/store/hooks";
import {
  PaymentProps,
  ProductSaleProps,
  SiteInfoProps,
  UserAddressProps,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaBoxOpen, FaTruckArrowRight } from "react-icons/fa6";
import { PatternFormat } from "react-number-format";
import { useDispatch } from "react-redux";
import { z } from "zod";
import PaymentDialog from "./PaymentDialog";
import { closest } from "color-2-name";
import { FaEdit } from "react-icons/fa";
import { TelegPage } from "@/components/TelegPage";
import { useTranslation } from "react-i18next";
import useLangNavigate from "@/hooks/useLangNavigate";
const ValidateCardList = z.object({
  name: z.string().min(1, { message: "sakin" }),
  phone: z.string().min(1, { message: "sakin" }),
  delivery_method: z.string().min(1, { message: "sakin" }),
  payment_type: z.string().min(1, { message: "sakin" }),
  address_name: z.string().min(1, { message: "sakin" }),
  address_longlat: z.string().min(1, { message: "sakin" }),
  items: z.array(
    z.object({
      product_id: z.number().min(1, { message: "sakin" }),
      quantity: z.number().min(1, { message: "sakin" }),
      color: z.string().min(1, { message: "sakin" }),
      size: z.string().min(1, { message: "sakin" }),
    })
  ),
});
interface PromoType {
  promo?: string;
  loading?: boolean;
  notFound?: string;
}
const CheckOut = () => {
  const { t } = useTranslation();
  const [promoValue, setPromoValue] = useState<PromoType>({
    promo: "",
    loading: false,
    notFound: "",
  });
  const navigate = useLangNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [loading, setLoading] = useState<boolean>(false);
  const [promoPrice, setPromoPrice] = useState<number>(0);
  const [openModal, setOpenModal] = useState<PaymentProps>({
    id: NaN,
    modal: false,
    payment_status: "",
  });
  const axiosPrivate = useAxios();
  const cartListStorage = useAppSelector((state) => state.cartList);
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof ValidateCardList>>({
    resolver: zodResolver(ValidateCardList),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      delivery_method: "",
      payment_type: "",
      address_name: "",
      address_longlat: "",
      promo_code: NaN,
      items: [
        {
          product_id: 0,
          quantity: 0,
          color: "",
          size: "",
        },
      ],
    },
  });

  const [userAddressQuery, siteInfoQuery] = useQueries({
    queries: [
      {
        queryKey: ["addressUser"],
        queryFn: async () => {
          const { data } = await axiosPrivate.get("/useraddres");
          return data.data;
        },
        enabled: true,
        retry: false,
      },
      {
        queryKey: ["siteInfoCheckOut"],
        queryFn: async () => {
          const { data } = await axiosPrivate.get<SiteInfoProps>("/siteinfo");
          return data && data;
        },
        enabled: true,
        retry: false,
      },
    ],
  });

  const onSubmit = async (values: z.infer<typeof ValidateCardList>) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.post("/orders/create", values);

      if (response.data) {
        setLoading(false);
        localStorage.setItem("cart-list", JSON.stringify([]));
        if (values.payment_type === "1") {
          return navigate(`/profile/orders?orderId=${response.data.data.id}`);
        }
        setOpenModal({
          id: response.data.data.id,
          modal: true,
          payment_status: values.payment_type,
        });
        localStorage.setItem(
          "lastOrderedId",
          JSON.stringify({
            id: response.data.data.id,
            paymentType: values.payment_type,
          })
        );
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    document.body.classList.remove("pb-20");
    dispatch(setHideSearch({ searchBar: false })); // Hide search bar on the Profile page
    dispatch(setHideNav(false)); // Hide search bar on the Profile page
    const storedCartList: ProductSaleProps[] = JSON.parse(
      localStorage.getItem("cart-list") || "[]"
    );
    dispatch(hydrateCardList(storedCartList));
    // Optional: Reset search visibility when navigating away
    return () => {
      dispatch(setHideSearch({ searchBar: true })); // Reset to visible if needed
      document.body.classList.add("pb-20");
      dispatch(setHideNav(true)); // Reset to visible if needed
    };
  }, [dispatch]);
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
  const totalQuantity = () => {
    return cartListStorage.reduce((arr, cerr) => arr + cerr.quantity, 0) ?? 0;
  };
  const handleCheckPromo = async () => {
    setPromoValue({ loading: true });
    try {
      const { data } = await axiosPrivate.post("/promo-check", {
        code: promoValue.promo,
      });
      if (data) {
        setPromoValue({
          loading: false,
          notFound: data.status,
          promo: promoValue.promo,
        });
        if (data.status === "success") {
          form.setValue("promo_code", data.id);
          setPromoPrice(data.price);
        }
      }
    } catch (err) {
      setPromoValue({
        loading: false,
        promo: promoValue.promo,
      });
    }
  };
  useEffect(() => {
    form.setValue(
      "items",
      cartListStorage.map((item) => ({
        product_id: item.id || 0,
        quantity: item.quantity || 0,
        color: item.color || "",
        size: item.size || "",
      }))
    );
    form.setValue("name", user?.user.name);
    form.setValue("phone", user?.user.phone.slice(4));
  }, [cartListStorage]);
  return (
    <TelegPage back={true}>
      <div>
        <div className="w-full text-center py-2 sticky top-0 bg-white">
          <h1 className="font-medium font-mono">{t("checkOut.title")}</h1>
        </div>
        <div className="px-4">
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <p className="font-mono font-medium text-xl mb-5">
                {t("checkOut.userData.title")}
              </p>
              <div className="flex flex-col w-full gap-5">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="email" className="font-mono font-semibold">
                    {t("checkOut.userData.firstName")}
                    <span className="text-red-700"> *</span>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    value={form.watch().name}
                    {...form.register("name", {
                      setValueAs: (value) => value,
                    })}
                    placeholder="Ismingizni yozing"
                    className="font-mono px-4 py-5"
                  />
                  {form.formState.errors.name && (
                    <span>{form.formState.errors.name.message}</span>
                  )}
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email" className="font-mono font-semibold">
                    {t("checkOut.userData.phone")}
                    <span className="text-red-700"> *</span>
                  </Label>
                  <PatternFormat
                    value={form.watch().phone}
                    onChange={(e) => {
                      form.setValue("phone", e.target.value);
                    }}
                    format="+998 ## ### ## ##"
                    className="font-mono px-4 py-5 flex h-9 w-full rounded-md border border-input bg-transparent text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    allowEmptyFormatting
                  />
                </div>
              </div>
              <span className="font-mono font- text-xs text-[#898c92] mt-2 inline-block">
                {t("checkOut.userData.validate")}
              </span>
            </div>
            <div className="mt-6">
              <p className="font-mono font-medium text-xl mb-5">
                {t("checkOut.getWithMap.title")}
              </p>
              <div>
                <Controller
                  name="delivery_method"
                  control={form.control}
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      value={value}
                      onValueChange={onChange}
                      className="grid grid-cols-2 gap-4"
                    >
                      <Label
                        onClick={() => {
                          if (
                            userAddressQuery.data &&
                            userAddressQuery.data.length > 0
                          ) {
                            form.setValue("address_name", "");
                            form.setValue("address_longlat", "");
                          } else {
                            navigate("/profile/map");
                          }
                        }}
                      >
                        <div className="bg-secondary p-4 rounded-lg cursor-pointer">
                          <FaTruckArrowRight fontSize={30} />
                          <div className="flex justify-between items-center mt-4">
                            <span className="font-mono font-normal text-sm">
                              {t("checkOut.getWithMap.delivery")}
                            </span>
                            <RadioGroupItem value="delivery" />
                          </div>
                        </div>
                      </Label>
                      <Label
                        onClick={() => {
                          form.setValue(
                            "address_name",
                            siteInfoQuery.data?.pickup_address.name
                          );
                          form.setValue(
                            "address_longlat",
                            siteInfoQuery.data?.pickup_address.longlat
                          );
                        }}
                      >
                        <div className="bg-secondary p-4 rounded-lg cursor-pointer">
                          <FaBoxOpen fontSize={30} />
                          <div className="flex justify-between items-center mt-4">
                            <span className="font-mono font-normal text-sm">
                              {t("checkOut.getWithMap.pickup")}
                            </span>
                            <RadioGroupItem value="pickup" />
                          </div>
                        </div>
                      </Label>
                    </RadioGroup>
                  )}
                />
                <div className="mt-4">
                  {form.watch().delivery_method === "delivery" &&
                    userAddressQuery.data && (
                      <Controller
                        name="address_longlat"
                        control={form.control}
                        render={({ field: { value, onChange } }) => (
                          <RadioGroup
                            value={value}
                            onValueChange={onChange}
                            className="grid grid-cols-1 gap-2"
                          >
                            {userAddressQuery.data.map(
                              (item: UserAddressProps) => (
                                <Label
                                  key={item.id + "addressUser"}
                                  onClick={() =>
                                    form.setValue("address_name", item.name)
                                  }
                                  className="w-full flex gap-3 border px-3 py-2 items-center rounded-lg cursor-pointer"
                                >
                                  <RadioGroupItem value={item.long_lat} />
                                  <div className="flex justify-between w-full items-center">
                                    <div>
                                      <h1>{item.name}</h1>
                                    </div>
                                    <div>
                                      <Button
                                        onClick={() =>
                                          navigate(
                                            `/profile/map?long=${
                                              item.long_lat.split(",")[1]
                                            }&lat=${
                                              item.long_lat.split(",")[0]
                                            }&name=${item.name}&id=${item.id}`
                                          )
                                        }
                                        type="button"
                                        variant="ghost"
                                      >
                                        <FaEdit />
                                      </Button>
                                    </div>
                                  </div>
                                </Label>
                              )
                            )}
                          </RadioGroup>
                        )}
                      />
                    )}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-mono font-medium text-xl mb-5">
                {t("checkOut.paymentSystem.title")}
              </p>
              <div>
                <Controller
                  name="payment_type"
                  control={form.control}
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      value={value}
                      onValueChange={onChange}
                      className="grid grid-cols-1 gap-5"
                    >
                      <Label>
                        <div className="py-3 px-5 rounded-lg flex gap-3 items-center cursor-pointer border">
                          <RadioGroupItem value="1" />
                          <div className="">
                            <span className="font-mono font-semibold text-base">
                              {t("checkOut.paymentSystem.payAfter.top")}
                            </span>{" "}
                            <br />
                            <span className="font-mono font-normal text-sm">
                              {t("checkOut.paymentSystem.payAfter.bottom")}
                            </span>
                          </div>
                        </div>
                      </Label>
                      <Label>
                        <div className="py-3 px-5 rounded-lg flex gap-3 items-center cursor-pointer border">
                          <RadioGroupItem value="2" />
                          <div className="">
                            <img
                              src={
                                "https://olcha.uz/billing/images/payments/payme.png"
                              }
                              alt="payme"
                              width={100}
                              height={20}
                            />
                          </div>
                        </div>
                      </Label>
                      {/* 
                      <Label>
                        <div className="py-3 px-5 rounded-lg flex gap-3 items-center cursor-pointer border">
                          <RadioGroupItem value="3" />
                          <div className="">
                            <img
                              src={
                                "https://olcha.uz/billing/images/payments/click.png"
                              }
                              alt="click"
                              width={100}
                              height={20}
                            />
                          </div>
                        </div>
                      </Label> */}
                    </RadioGroup>
                  )}
                />
              </div>
            </div>
            <div className="mt-5">
              <p className="font-mono font-medium text-xl mb-5">
                {t("checkOut.products")}
              </p>
              <div className="flex flex-col gap-3">
                {cartListStorage.map((item, index) => (
                  <div
                    key={index + "productInfo"}
                    className="flex w-full gap-4"
                  >
                    <div className="relative rounded-lg w-[50px] h-[50px] overflow-hidden flex-shrink-0">
                      <div className="overlay"></div>
                      <img
                        src={
                          item.images.filter((item) => !item.is_video)[0].url
                        }
                        alt="images"
                        width={50}
                        height={50}
                        className="!object-contain opacity-100 w-full h-full mix-blend-multiply card-image duration-300 inset-4"
                      />
                    </div>
                    <div className="flex justify-between w-full items-end">
                      <div className="flex flex-col w-full">
                        <div>
                          <p className="text-sm font-mono">{item.name}</p>
                          <div className="flex flex-col mt-2 text-xs">
                            <p className="text-[#A8ABB4]">
                              {t("common.size")}:{" "}
                              <span className="text-[#1f2026]">
                                {item.size}
                              </span>
                            </p>
                            <div className="flex justify-between w-full items-center">
                              <p className="text-[#A8ABB4]">
                                {t("common.color")}:{" "}
                                <span className="text-[#1f2026]">
                                  {closest(item.color).name}
                                </span>
                              </p>
                              <p
                                className={`line-through  text-[#b6b2b2] font-normal font-mono text-xs mb-[2px] ${
                                  !item.discount && "invisible"
                                }`}
                              >
                                {numberSpacing(item.price)}{" "}
                                {t("common.currency")}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between w-full items-center -mt-1">
                          <p className="text-xs text-[#A8ABB4]">
                            {t("profile.orders.cartOrder.totalOrder")}:{" "}
                            <span className="text-[#1f2026]">
                              {item.quantity} {t("common.amount")}
                            </span>
                          </p>
                          <p className="font-mono text-[15px] font-medium">
                            {numberSpacing(
                              item.discount
                                ? item.price - item.discount
                                : item.price
                            )}{" "}
                            {t("common.currency")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              <p className="font-mono font-medium text-xl">
                {t("profile.orders.cartOrder.orderYour")}
              </p>
              <div>
                <div className="flex justify-between items-center">
                  <span>
                    {t("checkOut.productsAmount")} ({totalQuantity()}):
                  </span>
                  <span>
                    {numberSpacing(totalAmount())} {t("common.currency")}
                  </span>
                </div>
                {promoValue.notFound === "success" && (
                  <div className="flex justify-between items-center">
                    <span>{t("common.promocodevalue")}:</span>
                    <span>
                      - {numberSpacing(promoPrice)} {t("common.currency")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>{t("checkOut.getWithMap.delivery")}:</span>
                  <span>{t("common.free")}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>{t("common.total")}:</span>
                <span className="text-xl font-mono font-medium">
                  {numberSpacing(totalAmount() - promoPrice)}{" "}
                  {t("common.currency")}
                </span>
              </div>
            </div>
            <div className="w-full mt-4 flex flex-col gap-4">
              <Collapsible className="bg-secondary py-3 px-4 rounded-md group/collapsible">
                <CollapsibleTrigger className="w-full flex items-center text-base text-left">
                  <ChevronRight className="transition-transform rotate-90 w-5 group-data-[state=open]/collapsible:rotate-[270deg] text-xs" />{" "}
                  {t("common.promocode")}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3 relative">
                    <div className="relative">
                      <Input
                        value={promoValue.promo}
                        onChange={(e) => {
                          setPromoValue({
                            promo: e.target.value,
                          });
                        }}
                        type="text"
                        readOnly={promoValue.notFound === "success" && true}
                        id="name"
                        placeholder="Введите промокод"
                        className={`font-mono text-sm px-4 py-3 bg-white ${
                          !promoValue.notFound && "border-green-40000"
                        }`}
                      />
                      <Button
                        type="button"
                        onClick={handleCheckPromo}
                        className="absolute top-0 right-0 text-sm h-full"
                      >
                        {promoValue.loading ? (
                          <span className="loader !w-5 !h-5"></span>
                        ) : (
                          t("common.btn.enter")
                        )}
                      </Button>
                    </div>
                    <span className={`text-xs`}>
                      {promoValue.loading
                        ? t("checkOut.promocodeValidate.loading")
                        : promoValue.notFound === "success"
                        ? t("checkOut.promocodeValidate.success")
                        : promoValue.notFound === "notfound"
                        ? t("checkOut.promocodeValidate.notFound")
                        : promoValue.notFound === "inactive"
                        ? t("checkOut.promocodeValidate.inActive")
                        : promoValue.notFound === "alreadyused" &&
                          t("checkOut.promocodeValidate.alreadyUsed")}
                    </span>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Button
                className="w-full py-6"
                type="submit"
                disabled={form.formState.isValid ? false : true}
              >
                {loading ? (
                  <span className="loader !w-8 !h-8"></span>
                ) : (
                  t("checkOut.toPay")
                )}
              </Button>
            </div>
          </form>
        </div>
        <PaymentDialog open={openModal.modal} paymentProps={openModal} />
      </div>
    </TelegPage>
  );
};

export default CheckOut;
