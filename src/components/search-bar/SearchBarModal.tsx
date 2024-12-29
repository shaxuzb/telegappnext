import React, { useEffect, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import SearchInput from "./SearchInput";
import { FaBackward } from "react-icons/fa6";
import SearchBarCard from "../cards/SearchBarCard";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import useAxios from "@/hooks/useAxios";
import { useAppDispatch } from "@/store/hooks";
import { setHideNav } from "@/store/features/navbarBarSlice";
import { useTranslation } from "react-i18next";
interface SearchModalProps {
  setModal: (isOpen: boolean) => void;
  modal: boolean;
}
const SearchBarModal: React.FC<SearchModalProps> = ({ setModal, modal }) => {
  const {t} = useTranslation()
  const [value, setValue] = useState<string>("");
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const axiosPrivate = useAxios();
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["searchQuery", searchParams.get("search")],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(
        `/products/all?search=${searchParams.get("search")}`
      );
      return data;
    },
    enabled: true,
    retry: false,
  });
  const handleChange = (e: any) => {
    setValue(e.target.value);
  };
  useEffect(() => {
    dispatch(setHideNav(false));
    const searchingTime = setTimeout(() => {
      searchParams.set("search", value);
      setSearchParams(searchParams);
    }, 300);

    return () => {
      dispatch(setHideNav(true));
      clearTimeout(searchingTime);
    };
  }, [value]);
  const modalOpen = {
    hidden: {
      height: "100%",
      opacity: 1,
    },
    open: {
      height: "100%",
      opacity: 1,
    },
    closed: { height: "100%", opacity: 1, transition: { duration: 0.3 } },
  };
  const handleCloseModal = () => {
    setModal(false);
  };

  return (
    <LayoutGroup>
      <motion.div
        layout
        variants={modalOpen}
        initial={"hidden"}
        animate={modal ? "open" : "closed"}
        exit="exit"
        className="fixed top-0 left-0 h-full w-full overflow-scroll bg-white z-50"
      >
        <div className="sticky top-0 z-[1] w-full bg-[#fff] pl-3 py-2 flex items-center gap-3">
          <motion.div
            variants={{
              hidden: { x: -10, opacity: 0 },
              enter: { x: 0, opacity: 1 },
              exits: { x: -10 },
            }}
            transition={{ duration: 0.1, delay: 0.1 }}
            initial="hidden"
            animate="enter"
            exit="exits"
            onClick={handleCloseModal}
            className="cursor-pointer z-10"
          >
            <FaBackward />
          </motion.div>
          <motion.div
            initial={{ top: 0 }}
            animate
            layoutId="input-search-header"
            className="w-full z-10"
          >
            <SearchInput value={value} onChange={handleChange} />
          </motion.div>
        </div>
        <div className="pl-3">
          {isFetching || isLoading ? (
            <div className="w-full h-full flex justify-center pt-8">
              <span className="loader !border-ring"></span>
            </div>
          ) : data.data && data.data.length > 0 ? (
            <SearchBarCard productSaleData={data.data} setModal={setModal} />
          ) : (
            <div className="flex justify-center !w-full mt-2">
              <div className="flex flex-col items-center justify-center">
                <img
                  src="https://asaxiy.uz/custom-assets/images/empty.svg"
                  alt=""
                />
                <h1 className="font-semibold text-lg">
                  {t("pages.searchNotFound.headerTitle")}
                </h1>
                <p className="text-center text-sm px-3">
                  {t("pages.searchNotFound.paragrafTitle")}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </LayoutGroup>
  );
};

export default SearchBarModal;
