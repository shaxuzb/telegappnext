import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { ProductSaleProps } from "@/types";

import { motion } from "framer-motion";
import { numberSpacing } from "@/lib/utils";
import {
  hydrateCardList,
  setAddCartList,
  setIncrementCartList,
  setRemoveCartList,
} from "@/store/features/cartListSlice";
import { useAppDispatch } from "@/store/hooks";
import { closest } from "color-2-name";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
interface ProductCardProps {
  cardListData: ProductSaleProps[] | [];
}
const ProdcutCardList: React.FC<ProductCardProps> = ({ cardListData }) => {
  const {t} = useTranslation()
  const dispatch = useAppDispatch();
  useEffect(() => {
    const storedCartList: ProductSaleProps[] = JSON.parse(
      localStorage.getItem("cart-list") || "[]"
    );
    dispatch(hydrateCardList(storedCartList));
  }, [dispatch]);

  const handleRemove = (item: ProductSaleProps) => {
    dispatch(setRemoveCartList(item));
  };
  const handleIncrement = (item: ProductSaleProps) => {
    dispatch(setIncrementCartList(item));
  };
  const handleAdd = (item: ProductSaleProps) => {
    dispatch(setAddCartList(item));
  };
  return cardListData.map((cardListItem: ProductSaleProps) => (
    <div
      key={cardListItem.id + cardListItem.color + cardListItem.size}
      className="border-b-[1px] py-5"
    >
      <div className="px-3">
        <div className="flex gap-5">
          <div className="relative rounded-2xl w-[100px] h-[100px] overflow-hidden flex-shrink-0">
            <div className="overlay"></div>
            <img
              src={
                cardListItem.images.filter(item => !item.is_video)[0].url
              }
              alt="images"
              width={100}
              height={100}
              className="!object-contain opacity-100 w-full h-full mix-blend-multiply card-image duration-300 inset-4"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div>
              <h1 className="text-sm"><Link to={`/product/${cardListItem.id}`}>{cardListItem.name}</Link></h1>
              <div className="flex flex-col mt-2 text-xs">
                <p className="text-[#A8ABB4]">
                  {t("common.size")}:{" "}
                  <span className="text-[#1f2026]">{cardListItem.size}</span>
                </p>
                <p className="text-[#A8ABB4]">
                {t("common.color")}:{" "}
                  <span className="text-[#1f2026]">
                    {closest(cardListItem.color).name}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex gap-2">
                <span
                  className={`line-through  text-[#b6b2b2] font-normal font-mono text-sm ${
                    !cardListItem.discount && "invisible"
                  }`}
                >
                  {numberSpacing(cardListItem.price * cardListItem.quantity)}{" "}
                  {t("common.currency")}
                </span>
              </div>
              <div>
                <span className="text-red-600 font-normal font-mono text-lg">
                  {numberSpacing(
                    (cardListItem.discount
                      ? cardListItem.price - cardListItem.discount
                      : cardListItem.price) * cardListItem.quantity
                  )}{" "}
                  {t("common.currency")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-end mt-3">
          <div className="relative">
            {cardListItem.quantity > 1 && (
              <motion.div
                className="text-[#b6b2b2] text-sm absolute text-nowrap left-[calc(100%_+_10px)] !top-1/2 !-translate-y-1/2"
                variants={{
                  hidden: { x: -10, opacity: 0 },
                  enter: { x: 10, opacity: 1 },
                  exits: { x: -10, opacity: 0 },
                }}
                initial="hidden"
                animate="enter"
                exit="exits"
              >
                {numberSpacing(
                  cardListItem.discount
                    ? cardListItem.price - cardListItem.discount
                    : cardListItem.price
                )}{" "}
                {t("common.priceOneAmont")}
              </motion.div>
            )}
            <div className="h-10 w-24 rounded-lg border flex justify-center items-center relative">
              <div className="absolute w-full flex justify-between">
                <Button
                  onClick={() => handleIncrement(cardListItem)}
                  className="w-[36px] bg-transparent shadow-none text-[#b6b2b2] text-2xl hover:bg-transparent"
                >
                  <FaMinus />
                </Button>
                <Button
                  onClick={() => handleAdd(cardListItem)}
                  className="w-[36px] bg-transparent shadow-none text-[#b6b2b2] text-2xl hover:bg-transparent"
                >
                  <FaPlus />
                </Button>
              </div>
              <span className="text-sm">{cardListItem.quantity}</span>
            </div>
          </div>
          <div>
            <Button
              onClick={() => handleRemove(cardListItem)}
              className="!bg-transparent !shadow-none !p-0 mr text-[#b6b2b2] hover:text-black"
            >
              <FaTrash />
              {t("common.btn.delete")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  ));
};

export default ProdcutCardList;
