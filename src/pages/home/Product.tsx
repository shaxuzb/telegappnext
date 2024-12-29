import { FaChevronRight } from "react-icons/fa6";
import { ProductSaleProps } from "@/types";
import { useQueries } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import SkletonCard from "@/components/skletons/SkletonCard";
import ProductCard from "@/components/cards/ProductCard";
import { Link } from "react-router-dom";
import ProductSlider from "@/components/cards/ProductSlider";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
interface MenuType {
  id: number;
  items: ProductSaleProps[];
  title_ru: string;
  title_uz: string;
}
const Product = () => {
  const { t, i18n } = useTranslation();
  const axiosPrivate = useAxios();
  const [popularProductQuery, rasprodajaQuery, recommendedQuery, menuQuery] =
    useQueries({
      queries: [
        {
          queryKey: ["popularProducts"],
          queryFn: async () => {
            const response = await axiosPrivate.get("/products/popular");
            return response && response.data.data;
          },
          enabled: true,
          retry: false,
        },
        {
          queryKey: ["rasprodaja"],
          queryFn: async () => {
            const response = await axiosPrivate.get("/products/sale");
            return response && response.data.data;
          },
          enabled: true,
          retry: false,
        },
        {
          queryKey: ["recomended"],
          queryFn: async () => {
            const response = await axiosPrivate.get("/products/recommended");
            return response && response.data.data;
          },
          enabled: true,
          retry: false,
        },
        {
          queryKey: ["menu"],
          queryFn: async () => {
            const response = await axiosPrivate.get("/menus");
            return response && response.data.data;
          },
          enabled: true,
          retry: false,
        },
      ],
    });

  return (
    <>
      {menuQuery.isFetching || menuQuery.isLoading ? (
        <div className="mt-8">
          <div className="flex justify-between items-center pb-4">
            <h1 className="font-medium font-mono">
              <Skeleton className="w-36 h-4" />
            </h1>
            <div>
              <Skeleton className="w-36 h-4" />
            </div>
          </div>
          <div className="[&>div]:!grid-cols-3 [&>div]:!min-w-96 overflow-hidden">
            <SkletonCard lengths={3} />
          </div>
        </div>
      ) : menuQuery.data ? (
        menuQuery.data.map((item: MenuType) => (
          <div className="mt-8">
            <div className="flex justify-between items-center pb-4">
              <h1 className="font-medium font-mono">
                {item[`title_${i18n.language}`]}
              </h1>
              <div>
                <Link
                  to={`/product/menu/${item.id}`}
                  className="flex items-center text-sm font-medium font-mono cursor-pointer"
                >
                  {t("common.viewAll")}
                  <FaChevronRight fontSize={13} />
                </Link>
              </div>
            </div>
            {item.items.length > 0 && (
              <ProductSlider productSaleData={item.items} />
            )}
          </div>
        ))
      ) : (
        "notFound"
      )}
      <div className="mt-3">
        <div>
          <h1 className="font-semibold text-[20px] pb-4">
            {t("common.recomend")}
          </h1>
        </div>
        {recommendedQuery.isLoading && recommendedQuery.isFetching ? (
          <SkletonCard lengths={4} />
        ) : recommendedQuery.data && recommendedQuery.data.length > 0 ? (
          <ProductCard productSaleData={recommendedQuery.data} />
        ) : (
          "Product yuq"
        )}
      </div>
      <div className="mt-8">
        <div className="flex justify-between items-center pb-4">
          <h1 className="font-medium font-mono">{t("common.saleProduct")}</h1>
          <div>
            <Link
              to="/product/sale"
              className="flex items-center text-sm font-medium font-mono cursor-pointer"
            >
              {t("common.viewAll")}
              <FaChevronRight fontSize={13} />
            </Link>
          </div>
        </div>
        {rasprodajaQuery.isLoading && rasprodajaQuery.isFetching ? (
          <div className="[&>div]:!grid-cols-3 [&>div]:!min-w-96 overflow-hidden">
            <SkletonCard lengths={3} />
          </div>
        ) : rasprodajaQuery.data && rasprodajaQuery.data.length > 0 ? (
          <ProductSlider productSaleData={rasprodajaQuery.data} />
        ) : (
          "product yuq"
        )}
      </div>
      <div className="mt-8">
        <div>
          <h1 className="font-semibold text-[20px] pb-4">
            {t("common.popularProduct")}
          </h1>
        </div>
        {popularProductQuery.isLoading && popularProductQuery.isFetching ? (
          <SkletonCard lengths={4} />
        ) :popularProductQuery.data && popularProductQuery.data.length > 0 ? (
          <ProductCard productSaleData={popularProductQuery.data} />
        ) : (
          "product yuq"
        )}
      </div>
    </>
  );
};

export default Product;
