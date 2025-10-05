import { ProductCategoryProps } from "@/types";
import React from "react";
import { useTranslation } from "react-i18next";
import LangLink from "../lang/LangLink";
interface CategoryCardProps {
  categoryList: ProductCategoryProps[] | [];
}
const CategoryCard: React.FC<CategoryCardProps> = ({ categoryList }) => {
  const {i18n} = useTranslation()
  return categoryList.map((item, index) => (
    <div
      key={index}
      className="w-20 aspect-square cursor-pointer"
      title={item[`name_${i18n.language}`]}
    >
      <LangLink to={`catalog/category/${item.id}`}>
        <div className="rounded-[14px] aspect-square overflow-hidden relative m-1">
          <div className="overlay"></div>
          <img
            src={item.image_path}
            alt="images"
            width={56}
            height={56}
            style={{
              width: "100%",
            }}
            className="!object-contain opacity-100 mix-blend-multiply card-image duration-300"
          />
        </div>
        <div>
          <p className="text-xs text-center line-clamp-2 font-mono pr-1">
            {item[`name_${i18n.language}`]}
          </p>
        </div>
      </LangLink>
    </div>  
  ));
};

export default CategoryCard;
