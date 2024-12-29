import OrdersCard from "@/components/cards/OrdersCard";
import { TelegPage } from "@/components/TelegPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAxios from "@/hooks/useAxios";
import { setHideSearch } from "@/store/features/searchBarSlice";
import { UserOrdersProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
const Orders = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const axiosPrivate = useAxios();
  const refCard = useRef([]);
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["userOrders"],
    queryFn: async () => {
      const { data } = await axiosPrivate.get("/orders");
      return data && data.data;
    },
    enabled: true,
    retry: false,
  });

  useEffect(() => {
    dispatch(setHideSearch({ searchBar: false }));

    return () => {
      dispatch(setHideSearch({ searchBar: true }));
    };
  }, [dispatch]);
  const [queryParams, setQueryParams] = useSearchParams();
  useEffect(() => {
    if(!queryParams.get("tabOrder")){
      queryParams.set("tabOrder","faol")
      setQueryParams(queryParams,{replace:true})
    }
    if (data) {
      const index = data?.findIndex(
        (orderItem: UserOrdersProps) => orderItem.id === +queryParams.get("orderId")
      );
      if (index !== -1 && refCard.current[index]) {
        refCard.current[index].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        refCard.current[index].classList.add("animateBack");

        const timeOutRef = setTimeout(() => {
          refCard.current[index].classList.remove("animateBack");
        }, 1000);
        return () => {
          clearTimeout(timeOutRef);
        };
      }
    }
  }, [queryParams, data, ]);
  return (
    <TelegPage back={true}>
      <div className="pb-16">
        <div className="flex justify-center items-center h-12 text-xl font-normal font-mono">
          <h1>{t("profile.orders.title")}</h1>
        </div>
        <div>
          <Tabs defaultValue="faol" value={queryParams.get("tabOrder")} onValueChange={(e)=>{
            queryParams.set("tabOrder", e)
            setQueryParams(queryParams,{replace:true})
          }}className="w-full">
            <TabsList className="w-full bg-transparent">
              <TabsTrigger
                value="faol"
                className="w-full aria-[selected=true]:!rounded-none aria-[selected=true]:!shadow-none aria-[selected=true]:!border-b aria-[selected=true]:border-b-ring aria-[selected=true]:!text-ring"
              >
                {t("profile.orders.active")}
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="w-full aria-[selected=true]:!rounded-none aria-[selected=true]:!shadow-none aria-[selected=true]:!border-b aria-[selected=true]:border-b-ring aria-[selected=true]:!text-ring"
              >
                {t("profile.orders.allOrder")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="faol">
              <div className="px-3 mt-6 flex flex-col gap-4">
                {isFetching || isLoading ? (
                  <div className="w-full h-52 flex justify-center items-center relative">
                    <span className="loader !border-ring"></span>
                  </div>
                ) : data &&
                  data.some(
                    (item: UserOrdersProps) => item.status !== "delivered" && item.status !== "cancelled"
                  ) &&
                  data.length > 0 ? (
                  data
                    .filter(
                      (item: UserOrdersProps) => item.status !== "delivered" && item.status !== "cancelled"
                    )
                    .map((item: UserOrdersProps, index: number) => (
                      <OrdersCard
                        refCard={refCard}
                        index={index}
                        key={item.id}
                        orderData={item}
                        refetch={refetch}
                      />
                    ))
                ) : (
                  <div className="flex justify-center pt-4">
                    <span>{t("profile.orders.noOrder")}</span>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="all">
              <div className="px-3 mt-6 flex flex-col gap-4">
                {isFetching || isLoading ? (
                  <div className="w-full h-52 flex justify-center items-center relative">
                    <span className="loader !border-ring"></span>
                  </div>
                ) : data && data.length > 0 ? (
                  data.map((item: UserOrdersProps, index: number) => (
                    <OrdersCard
                      refCard={refCard}
                      index={index}
                      key={item.id}
                      orderData={item}
                      refetch={refetch}
                    />
                  ))
                ) : (
                  <div className="flex justify-center pt-4">
                    <span>{t("profile.orders.noOrder")}</span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TelegPage>
  );
};

export default Orders;
