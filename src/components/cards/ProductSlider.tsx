import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import { ProductSaleProps } from "@/types";
import { numberSpacing } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import bigSale from "@/assets/images/bigSale.png";
import LangLink from "../lang/LangLink";
interface ProductCardProps {
  productSaleData: [] | ProductSaleProps[];
}
const ProductSlider: React.FC<ProductCardProps> = ({ productSaleData }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full">
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={15}
        freeMode={true}
        modules={[FreeMode]}
        className="mySwiper !w-full"
      >
        {productSaleData.map((productSaleItem: ProductSaleProps) => (
          <SwiperSlide key={productSaleItem.id} className="!w-36">
            <LangLink to={`product/${productSaleItem.id}`}>
              <div
                className="w-full card duration-300 cursor-pointer"
                title={productSaleItem.name}
              >
                <Swiper
                  slidesPerView={1}
                  spaceBetween={3}
                  pagination={{
                    el: ".swiper-pagination",
                    clickable: true,
                  }}
                  modules={[Pagination]}
                  className="mySwiper !w-full rounded-[30px] overflow-hidden relative"
                >
                  <SwiperSlide>
                    <div className="rounded-[20px] overflow-hidden aspect-square relative">
                      {productSaleItem.discount && (
                        <img
                          src={bigSale}
                          width={50}
                          className="absolute z-30 top-0 left-0"
                          alt="bigsale"
                        />
                      )}
                      <div className="overlay"></div>
                      <img
                        src={
                          productSaleItem.images.filter(
                            (item) => !item.is_video
                          )[0].url
                        }
                        alt="images"
                        width={480}
                        height={480}
                        className="!object-contain opacity-100 mix-blend-multiply card-image duration-300"
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
                <div>
                  <div className="mt-2">
                    <p className="text-sm line-clamp-2 h-10 font-mono pr-1">
                      {productSaleItem.name}
                    </p>
                  </div>

                  <div className="flex flex-col mt-2">
                    <div className="flex flex-col">
                      <span className="line-through text-[#b6b2b2] font-mono text-xs">
                        {productSaleItem.discount &&
                          numberSpacing(productSaleItem.price)}{" "}
                        {t("common.currency")}
                      </span>
                      <span className="font-medium font-mono text-lg text-red-700">
                        {numberSpacing(productSaleItem.discount)}{" "}
                        {t("common.currency")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </LangLink>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
