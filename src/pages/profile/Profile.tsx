import { TelegPage } from "@/components/TelegPage";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import telegram from "@/assets/images/social/telegram.png";
import instagram from "@/assets/images/social/instagram.png";
import phone from "@/assets/images/social/phone.png";
import rus from "@/assets/images/langImage/rus.png";
import uz from "@/assets/images/langImage/uz.png";
import useAxios from "@/hooks/useAxios";
import { avatarLetter } from "@/lib/utils";
import { setHideSearch } from "@/store/features/searchBarSlice";
import { SiteInfoProps, UserAddressProps } from "@/types";
import { useQueries } from "@tanstack/react-query";
import bgImage from "@/assets/images/profilebgColor.jpg";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import { FaHome, FaRegQuestionCircle, FaShoppingBag } from "react-icons/fa";
import { FaAngleRight, FaPlus, FaRegMap } from "react-icons/fa6";
import { IoClose, IoShareSocialSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  MdMapsHomeWork,
  MdOutlineDeleteOutline,
  MdOutlineEditLocationAlt,
  MdOutlineMail,
} from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useLangNavigate from "@/hooks/useLangNavigate";
import LangLink from "@/components/lang/LangLink";

const images = [
  {
    image: instagram,
  },
  {
    image: telegram,
  },
];
const imagesContact = [
  {
    image: telegram,
  },
  {
    image: phone,
  },
];
export default function Profile() {
  const { t, i18n } = useTranslation();
  const [languageModal, setLanguageModal] = useState<boolean>(false);
  const [deleteAddressModal, setDeleteAddressModal] = useState<boolean>(false);
  const [deleteAddressLoading, setDeleteAddressLoading] =
    useState<boolean>(false);
  const { initData } = retrieveLaunchParams();
  const navigate = useLangNavigate();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "uz");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const axiosPrivate = useAxios();
  const [addressQuery, siteInfoQuery] = useQueries({
    queries: [
      {
        queryKey: ["useAddress"],
        queryFn: async () => {
          const { data } = await axiosPrivate.get("/useraddres");
          return data && data.data;
        },
        enabled: true,
        retry: false,
      },
      {
        queryKey: ["siteInfo"],
        queryFn: async () => {
          const { data } = await axiosPrivate.get<SiteInfoProps>("/siteinfo");
          return data && data;
        },
        enabled: true,
        retry: false,
      },
    ],
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setHideSearch({ searchBar: false }));
    return () => {
      dispatch(setHideSearch({ searchBar: true }));
    };
  }, [dispatch]);
const handleChangeLng = (newLang: string) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    setLang(newLang);
    window.location.pathname = `/${newLang}${window.location.pathname.replace(/^\/(uz|ru)/, "")}`; // ✅ Sahifani yangi tilda ochish
  };
  const handleDeleteAddress = async (id: number) => {
    setDeleteAddressLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/deleteaddress/${id}`);
      if (data) {
        setDeleteAddressModal(false);
        addressQuery.refetch();
        setDeleteAddressLoading(false);
      }
    } catch (err) {
      console.error(err);
      setDeleteAddressLoading(false);
    }
  };
  return (
    <TelegPage back={false}>
      <div>
        <div
          className="!bg-cover"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="w-full justify-center items-center pt-2">
            <h1 className="text-center text-white text-lg">
              {t("profile.title")}
            </h1>
          </div>
          <div className="flex items-center gap-1 px-3 pb-3">
            <Avatar className="flex w-20 h-20 justify-center items-center">
              {initData?.user?.photoUrl ? (
                <img
                  src={initData?.user?.photoUrl}
                  alt="userImage"
                  width={60}
                  height={60}
                  className="rounded-full border"
                />
              ) : (
                avatarLetter(initData.user.firstName)
              )}
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-base text-white">{initData.user.firstName}</p>
              <p className="text-base text-white">{user.user.phone}</p>
            </div>
          </div>
        </div>
        <div>
          <div>
            <LangLink to={"orders"}>
              <div className="flex justify-between items-center px-4 text-[#797979] text-lg py-3 border-b">
                <div className="flex items-center gap-4">
                  <FaShoppingBag />
                  <span>{t("profile.orders.title")}</span>
                </div>
                <div>
                  <FaAngleRight />
                </div>
              </div>
            </LangLink>
            <LangLink
              to={`map/get?lat=${
                siteInfoQuery.data?.pickup_address.longlat.split(",")[0]
              }&long=${siteInfoQuery.data?.pickup_address.longlat
                .split(",")[1]
                .trim()}`}
            >
              <div className="flex justify-between items-center px-4 text-lg py-3 border-b text-[#797979]">
                <div className="flex items-center gap-4">
                  <MdMapsHomeWork />
                  <span>{t("profile.punktSend")}</span>
                </div>
                <div>
                  <FaAngleRight />
                </div>
              </div>
            </LangLink>
            <Drawer>
              <DrawerTrigger asChild>
                <div className="flex justify-between items-center px-4 text-lg py-3 border-b cursor-pointer text-[#797979]">
                  <div className="flex items-center gap-4">
                    <FaRegMap />
                    <span>{t("profile.address")}</span>
                  </div>
                  <div>
                    <FaAngleRight />
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent className="bg-white rounded-t-[3%] h-4/5">
                <DrawerTitle className=" flex justify-between items-center px-3">
                  <p className="text-3xl font-mono font-bold">
                    {t("profile.address")}
                  </p>
                  <DrawerClose className="bg-red-50 p-1 rounded-full overflow-hidden">
                    <IoClose fontSize={20} />
                  </DrawerClose>
                </DrawerTitle>
                <div className="px-3 pl-5 mt-4">
                  {addressQuery.data &&
                    addressQuery.data?.map((item: UserAddressProps) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center border-b py-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <Button className="bg-ring/10 h-10 w-10 rounded-full text-ring hover:bg-ring/10">
                            <FaHome />
                          </Button>
                          <div>
                            <h1 className="font-medium font-mono line-clamp-2">
                              {item.name}
                            </h1>
                            {/* <p className="text-sm text-[#A8ABB4] font-mono">
                              населённый пункт Суфи
                            </p> */}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="ghost"
                            className="p-0 h-auto "
                            onClick={() => {
                              navigate(
                                `map?long=${item.long_lat.split(",")[1]}&lat=${
                                  item.long_lat.split(",")[0]
                                }&name=${item.name}&id=${item.id}`
                              );
                            }}
                          >
                            <MdOutlineEditLocationAlt />
                          </Button>
                          <AlertDialog
                            open={deleteAddressModal}
                            onOpenChange={setDeleteAddressModal}
                          >
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" className="p-0 h-auto ">
                                <MdOutlineDeleteOutline />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {t("cancelActionAddress.actionTitle")}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t("cancelActionAddress.actionDescription")}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {t("common.btn.cancel")}
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={()=>handleDeleteAddress(item.id)} className="bg-[#F13637] hover:bg-[#F13637]/90">
                                  {deleteAddressLoading ? (
                                    <span className="loader !w-6 !h-6"></span>
                                  ) : (
                                    t("common.btn.delete")
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  <LangLink to="map">
                    <div className="flex justify-between items-center border-b py-3 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <Button className="bg-ring/10 h-10 w-10 rounded-full text-ring">
                          <FaPlus />
                        </Button>
                        <div>
                          <h1 className="font-medium font-mono">
                            {t("profile.createAddress")}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </LangLink>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <div>
            <Drawer open={languageModal} onOpenChange={setLanguageModal}>
              <DrawerTrigger asChild>
                <div className="flex justify-between items-center px-4 text-lg py-3 border-b-8 border-t-8 cursor-pointer text-[#797979]">
                  <div className="flex items-center gap-4">
                    {lang === "uz" ? (
                      <img width={20} loading="lazy" src={uz} alt="uz imgate" />
                    ) : (
                      <img width={20} loading="lazy" src={rus} alt="ru image" />
                    )}
                    <span>{t("profile.language")}</span>
                  </div>
                  <div>
                    <FaAngleRight />
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent className="bg-white rounded-t-[3%] h-52">
                <DrawerTitle className=" flex justify-between items-center px-3">
                  <p className="text-xl font-mono font-bold">
                    {t("profile.language")}
                  </p>
                  <DrawerClose className="bg-secondary p-1 rounded-full overflow-hidden">
                    <IoClose fontSize={20} />
                  </DrawerClose>
                </DrawerTitle>
                <RadioGroup
                  value={lang}
                  className="mt-4"
                  onValueChange={(e) => {
                    handleChangeLng(e);
                    setLanguageModal(false);
                  }}
                >
                  <Label>
                    <div>
                      <div className="flex justify-between items-center border-b py-3 px-3 cursor-pointer">
                        <div className="flex items-center gap-4 w-full">
                          <RadioGroupItem value="ru" />
                          <div className="flex justify-between w-full items-center">
                            <h1 className="font-medium font-mono">Русский</h1>
                            <div>
                              <img src={rus} loading="lazy" width={25} alt="" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Label>
                      <div className="flex justify-between items-center border-b px-3 py-3 cursor-pointer">
                        <div className="flex items-center gap-4 w-full">
                          <RadioGroupItem value="uz" />
                          <div className="flex justify-between w-full items-center">
                            <h1 className="font-medium font-mono">Uzbekcha</h1>
                            <div>
                              <img src={uz} loading="lazy" width={25} alt="" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </Label>
                </RadioGroup>
              </DrawerContent>
            </Drawer>
          </div>
          <div>
            <Drawer>
              <DrawerTrigger asChild>
                <div className="flex justify-between items-center px-4 text-lg py-3 border-b cursor-pointer text-[#797979]">
                  <div className="flex items-center gap-4">
                    <FaRegQuestionCircle />
                    <span>{t("profile.information")}</span>
                  </div>
                  <div>
                    <FaAngleRight />
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent
                title="red"
                className="bg-white rounded-t-[3%] h-4/5"
              >
                <DrawerTitle className=" flex justify-between items-center px-3">
                  <p className="text-base font-mono font-medium text-center w-full">
                    {t("profile.information")}
                  </p>
                  <DrawerClose className="bg-red-50 p-1 rounded-full overflow-hidden">
                    <IoClose fontSize={20} />
                  </DrawerClose>
                </DrawerTitle>
                <div className="px-3 pl-5 mt-1 overflow-scroll">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: siteInfoQuery.data && siteInfoQuery.data.info,
                    }}
                  ></div>
                </div>
              </DrawerContent>
            </Drawer>
            <Drawer>
              <DrawerTrigger asChild>
                <div className="flex justify-between items-center px-4 text-lg py-3 border-b cursor-pointer text-[#797979]">
                  <div className="flex items-center gap-4">
                    <IoShareSocialSharp />
                    <span>{t("profile.social")}</span>
                  </div>
                  <div>
                    <FaAngleRight />
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent
                title="red"
                className="bg-white rounded-t-[3%] h-4/5"
              >
                <DrawerTitle className=" flex justify-between items-center px-3">
                  <p className="text-base font-mono font-medium text-center w-full">
                    {t("profile.social")}
                  </p>
                  <DrawerClose className="bg-red-50 p-1 rounded-full overflow-hidden">
                    <IoClose fontSize={20} />
                  </DrawerClose>
                </DrawerTitle>
                <div className="px-3 pl-5 mt-1">
                  {siteInfoQuery.data &&
                    siteInfoQuery.data.social?.map((item, index) => (
                      <LangLink
                        to={item.url}
                        target="_blank"
                        // key={item.id}
                        className="flex justify-between items-center border-b py-3 cursor-pointer"
                      >
                        <div className="flex items-center w-10 aspect-square gap-4">
                          <img
                            src={images[index].image}
                            width={"100%"}
                            loading="lazy"
                            alt="instagram"
                          />
                          <div>
                            <h1 className="font-medium font-mono">
                              {item.name}
                            </h1>
                            {/* <p className="text-sm text-[#A8ABB4] font-mono">
                              населённый пункт Суфи
                            </p> */}
                          </div>
                        </div>
                        <div>
                          <FaAngleRight />
                        </div>
                      </LangLink>
                    ))}
                </div>
              </DrawerContent>
            </Drawer>
            <Drawer>
              <DrawerTrigger asChild>
                <div className="flex justify-between items-center px-4 text-lg py-3 border-b cursor-pointer text-[#797979]">
                  <div className="flex items-center gap-4">
                    <MdOutlineMail />
                    <span>{t("profile.contactus")}</span>
                  </div>
                  <div>
                    <FaAngleRight />
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent
                title="red"
                className="bg-white rounded-t-[3%] h-48"
              >
                <DrawerTitle className=" flex justify-between items-center px-3 mt-1">
                  <p className="text-lg font-mono font-medium text-center w-full">
                    {t("profile.contactus")}
                  </p>
                </DrawerTitle>
                <div className="px-3 pl-5 mt-1 flex justify-center gap-6 w-full">
                  {siteInfoQuery.data &&
                    siteInfoQuery.data.call?.map((item, index) => (
                      <LangLink
                        to={item.url}
                        target="_blank"
                        // key={item.id}
                        className="flex justify-center items-center py-3 cursor-pointer"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <img
                            src={imagesContact[index].image}
                            width={45}
                            loading="lazy"
                            alt="instagram"
                          />
                          <div>
                            <h1 className="font-medium font-mono text-sm">
                              {item.name}
                            </h1>
                          </div>
                        </div>
                      </LangLink>
                    ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </TelegPage>
  );
}
