import useAxios from "@/hooks/useAxios";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ProductInfo from "./product-info/ProductInfo";
import ProductCard from "@/components/cards/ProductCard";
import SkletonCard from "@/components/skletons/SkletonCard";
import { TelegPage } from "@/components/TelegPage";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { setHideNav } from "@/store/features/navbarBarSlice";
import { useAppDispatch } from "@/store/hooks";

export default function ProductDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxios();
  const [getProductInfoQuery, getPopularProductsQuery, getDescriptionQuery] =
    useQueries({
      queries: [
        {
          queryKey: ["productDetail", params.id],
          queryFn: async () => {
            const { data } = await axiosPrivate.get(`/product/${params.id}`);
            return data && data.data;
          },
          enabled: true,
          retry: false,
        },
        {
          queryKey: ["allProduct", params.id],
          queryFn: async () => {
            const { data } = await axiosPrivate.get(
              `/products/recommended?product_id=${params.id}`
            );
            return data && data.data;
          },
          enabled: true,
          retry: false,
        },
        {
          queryKey: ["descriptionProductsadfasf", params.id],
          queryFn: async () => {
            const { data } = await axiosPrivate.get(
              `/discriptions/${params.id}`
            );
            return data && data;
          },
          enabled: true,
          retry: false,
        },
      ],
    });
  useEffect(() => {
    dispatch(setHideNav(false)); // Hide nav bar on the Profile page
    return () => {
      dispatch(setHideNav(true)); // Reset to visible if needed
    };
  }, [dispatch]);
  return (
    <TelegPage back={true}>
      <div className="pb-16">
        {getProductInfoQuery.isFetching || getProductInfoQuery.isLoading ? (
          <div className="w-full h-[calc(100vh_-_300px)] flex justify-center">
            <span className="loader !border-ring mt-12"></span>
          </div>
        ) : (
          getProductInfoQuery.data && (
            <ProductInfo
              productInfoData={getProductInfoQuery.data}
              ratingDescInfo={getDescriptionQuery.data}
            />
          )
        )}
        {getProductInfoQuery.data && (
          <div className="mt-8 px-3">
            <div>
              <h1 className="font-semibold text-[20px] pb-4">
                {t("common.recomend")}
              </h1>
            </div>
            {getPopularProductsQuery.isFetching ||
            getPopularProductsQuery.isLoading ? (
              <SkletonCard lengths={4} />
            ) : getPopularProductsQuery.data?.length > 0 ? (
              <ProductCard productSaleData={getPopularProductsQuery.data} />
            ) : (
              "product yuq"
            )}
          </div>
        )}
      </div>
    </TelegPage>
  );
}
