import ProductCard from "@/components/cards/ProductCard";
import Filter from "@/components/filter/Filter";
import SkletonCard from "@/components/skletons/SkletonCard";
import { TelegPage } from "@/components/TelegPage";
import { Sheet } from "@/components/ui/sheet";
import useAxios from "@/hooks/useAxios";
import { setModalFilter, setShowFilter } from "@/store/features/searchBarSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

export default function Product() {
  const { t } = useTranslation();
  const searchBar = useAppSelector((state) => state.searchBarHide);
  const params = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [queryParams, _] = useSearchParams();
  const axiosPrivate = useAxios();
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [
        "popularProducts",
        params.id,
        Object.fromEntries(queryParams.entries()),
      ],
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const { data } = await axiosPrivate.get(
          params.id
            ? `/productsbycategory/${params.id}?page=${pageParam}`
            : location.pathname.includes("sale")
            ? `/products/sale?page=${pageParam}`
            : `products/all?page=${pageParam}`,
          {
            params: Object.fromEntries(queryParams.entries()),
          }
        );
        return data && data.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPage) => {
        return lastPage.length ? allPage.length + 1 : undefined;
      },
      enabled: true,
      retry: false,
    });
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50
    ) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage(); // Increment page
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    dispatch(setShowFilter({ filterBar: true }));
    return () => {
      dispatch(setShowFilter({ filterBar: false }));
    };
  }, []);
  return (
    <TelegPage back={true}>
      <div className="mt-3">
        <div className="category"></div>
        <div className="px-3">
          {isLoading ? (
            <SkletonCard lengths={6} />
          ) : data.pages && data.pages.length > 0 ? (
            data.pages.map((page) => <ProductCard productSaleData={page} />)
          ) : (
            <div className="flex justify-center !w-full mt-2">
              <div className="flex flex-col items-center justify-center">
                <img
                  src="https://asaxiy.uz/custom-assets/images/empty.svg"
                  alt=""
                />
                <h1 className="font-semibold text-lg">
                  {t("pages.filterNotfound.headerTitle")}
                </h1>
                <p className="text-center text-sm px-3">
                  {t("pages.filterNotfound.paragrafTitle")}
                </p>
              </div>
            </div>
          )}
          {isFetchingNextPage && !hasNextPage && (
            <div className="flex w-full justify-center items-center h-28">
              <span className="loader !border-ring"></span>
            </div>
          )}
          {/* {!hasNextPage && (
            <div className="flex justify-center mt-3">
              {t("profile.orders.cartOrder.comment.noData")}
            </div>
          )} */}
        </div>
        <Sheet
          onOpenChange={() => dispatch(setModalFilter({ filterModal: !true }))}
          open={searchBar.filterModal}
        >
          <Filter />
        </Sheet>
      </div>
    </TelegPage>
  );
}
