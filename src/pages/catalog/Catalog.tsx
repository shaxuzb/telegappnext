import CategoryCard from "@/components/cards/CategoryCard";
import { TelegPage } from "@/components/TelegPage";
import { Skeleton } from "@/components/ui/skeleton";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const Catalog = () => {
  const { t } = useTranslation();
  const axiosPrivate = useAxios();
  const { isFetching, isLoading, data } = useQuery({
    queryKey: ["catalogs"],
    queryFn: async () => {
      const { data } = await axiosPrivate.get("/categorys");
      return data && data;
    },
    enabled: true,
    retry: false,
  });
  return (
    <TelegPage back={false}>
      <div className="px-3">
        <h1 className="font-semibold font-mono text-[20px] mt-1">
          {t("navbar.katalog")}
        </h1>
        {isFetching || isLoading ? (
          <div className="flex gap-3 justify-start flex-wrap mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="cursor-pointer">
                <div className="rounded-[10px] w-[70px] h-[70px] overflow-hidden relative m-1">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="relative flex justify-center mt-2">
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : data &&  data.length > 0 ? (
          <div
            className={`flex gap-3 flex-wrap mt-2 ${
              data.length > 5 && "justify-between"
            }`}
          >
            <CategoryCard categoryList={data} />
          </div>
        ) : (
          <div className="flex justify-center !w-full mt-2">
            <div className="flex flex-col items-center justify-center">
              <img
                src="https://asaxiy.uz/custom-assets/images/empty.svg"
                alt=""
              />
              <h1 className="font-semibold text-lg">{t("pages.productNotFound.headerTitle")}</h1>
              <p className="text-center text-sm px-3">{t("pages.productNotFound.paragrafTitle")}</p>
            </div>
          </div>
        )}
      </div>
    </TelegPage>
  );
};

export default Catalog;
