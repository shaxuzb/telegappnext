import useAxios from "@/hooks/useAxios";
import Favourites from "./components/Favourites";
import { useQuery } from "@tanstack/react-query";
import SkletonCard from "@/components/skletons/SkletonCard";
import ProductCard from "@/components/cards/ProductCard";
import { TelegPage } from "@/components/TelegPage";
import { useTranslation } from "react-i18next";

export default function Favourite() {
  const {t} = useTranslation()
  const axiosPrivate = useAxios();
  const { isFetching, isLoading, data } = useQuery({
    queryKey: ["productAll"],
    queryFn: async () => {
      const { data } = await axiosPrivate.get("/products/popular");
      return data && data.data;
    },
    enabled: true,
    retry: false,
  });
  return (
    <TelegPage back={false}>
      <div>
        <Favourites />
        <div className="mt-8 px-3">
          <div>
            <h1 className="font-semibold text-[20px] pb-4">
            {t("common.popularProduct")}
            </h1>
          </div>
          {isFetching || isLoading ? (
            <SkletonCard lengths={4} />
          ) : data && data?.length > 0 ? (
            <ProductCard productSaleData={data} />
          ) : (
            "product yuq"
          )}
        </div>
      </div>
    </TelegPage>
  );
}
