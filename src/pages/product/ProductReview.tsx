import { TelegPage } from "@/components/TelegPage";
import useAxios from "@/hooks/useAxios";
import { setHideNav } from "@/store/features/navbarBarSlice";
import { setHideSearch } from "@/store/features/searchBarSlice";
import { useAppDispatch } from "@/store/hooks";
import { RatingTypes } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoStar } from "react-icons/io5";
import Rating from "react-rating";
import { useParams } from "react-router-dom";
import dayJs from "dayjs";
// type ReviewResponse = {
//   data: RatingTypes[];
//   nextPage: number | null;
// };

const ProductReview = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxios();
  const params = useParams();

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [`descriptionProduct${params.id}`, params.id],
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const { data } = await axiosPrivate.get(
          `/discriptions/${params.id}?page=${pageParam}`
        );
        return data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPage) => {
        return lastPage ? allPage.length + 1 : undefined;
      },
      enabled: !!params.id, // Ensure params.id is defined
      retry: false,
    });

  useEffect(() => {
    document.body.classList.remove("pb-20");
    dispatch(setHideSearch({ searchBar: false })); // Hide search bar on the Profile page
    dispatch(setHideNav(false)); // Hide nav bar on the Profile page
    return () => {
      dispatch(setHideSearch({ searchBar: true })); // Reset to visible if needed
      document.body.classList.add("pb-20");
      dispatch(setHideNav(true)); // Reset to visible if needed
    };
  }, [dispatch]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50
    ) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage]);

  return (
    <TelegPage back={true}>
      <div>
        <div className="w-full bg-white z-20 flex justify-center items-center py-2 sticky top-0 text-lg font-medium">
          {t("profile.orders.cartOrder.comment.moreTitle")}
        </div>
        <div className="px-3">
          {isLoading ? (
            <div className="flex w-full justify-center items-center h-28">
              <span className="loader !border-ring"></span>
            </div>
          ) : (
            data.pages.map((page) =>
              page.data.map((item: RatingTypes) => (
                <div
                  key={item.id}
                  className="overflow-hidden relative border-b  py-4"
                >
                  <div>
                    <div>
                      <Rating
                        initialRating={+item.rating}
                        readonly
                        emptySymbol={<IoStar color="#DEE0E5" />}
                        fullSymbol={<IoStar color="#FFB54C" />}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <h1 className="font-semibold ">{item.user.name}</h1>
                      <div>{dayJs(item.created_at).format("DD MMM YYYY")}</div>
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold">
                          {t("profile.orders.cartOrder.comment.comm")}:<br />
                        </span>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
          {isFetchingNextPage && !hasNextPage && (
            <div className="flex w-full justify-center items-center h-28">
              <span className="loader !border-ring"></span>
            </div>
          )}
          {!hasNextPage && (
            <div className="flex justify-center mt-3">
              {t("profile.orders.cartOrder.comment.noData")}
            </div>
          )}
        </div>
      </div>
    </TelegPage>
  );
};

export default ProductReview;
