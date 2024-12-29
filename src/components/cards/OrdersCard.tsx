"use client";
import React, { useState } from "react";
import { numberSpacing, statusOrdered } from "@/lib/utils";
import { ProductSaleInfoProps, UserOrdersProps } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
const ValidateOrderDisc = z.object({
  rating: z.number().min(1, { message: "sakin" }),
  description: z.string().optional(),
  product_id: z.number().min(1),
});
interface OrderCardProps {
  orderData: UserOrdersProps;
  refetch: () => void;
  refCard: any;
  index: number;
}
import Rating from "react-rating";
import { IoStar } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import PaymentDialog from "@/pages/cart-list/checkout/PaymentDialog";

const OrdersCard: React.FC<OrderCardProps> = ({
  orderData,
  refetch,
  refCard,
  index,
}) => {
  const { t } = useTranslation();
  const axiosPrivate = useAxios();
  const [loading, setLoading] = useState<boolean>(false);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [paymentModal, setPaymentModal] = useState<boolean>(false);
  const { data } = useQuery({
    queryKey: ["orderDetail", orderData.id],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(`/order/${orderData.id}`);
      return data && data.data;
    },
    enabled: !!orderData.id,
    retry: false,
  });

  const form = useForm<z.infer<typeof ValidateOrderDisc>>({
    resolver: zodResolver(ValidateOrderDisc),
    mode: "onChange",
    defaultValues: {
      rating: NaN,
      description: "",
      product_id: NaN,
    },
  });

  const onSubmit = async (values: z.infer<typeof ValidateOrderDisc>) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.post("/adddiscription", values);

      if (response.data) {
        setLoading(false);
        setOpenSheet(false);
        form.reset();
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const cancelOrder = async (id: number) => {
    try {
      const response = await axiosPrivate.get(`/orders/cancel/${id}`);

      if (response.data) {
        refetch();
      }
    } catch (err) {
      console.log(err);
    }
  };
  //ref={(el) => (ref.current[index] = el)}
  return (
    <div
      className="border p-4 rounded-lg"
      ref={(el) => (refCard.current[index] = el)}
      key={orderData.id}
    >
      <div className="flex justify-between items-center border-b pb-4 gap-1">
        <h1 className="text-base">
          {t("profile.orders.cartOrder.idOrder")} {orderData.id}
        </h1>
        <div className="text-nowrap">{orderData.status === "delivered" && orderData.delivery_method === "pickup"?statusOrdered("deliverytouser") : statusOrdered(orderData.status)}</div>
      </div>
      <div className="table w-full">
        <div className="table-row">
          <div className="table-cell table-order-th">
            <span>{t("profile.orders.cartOrder.orderTypeName")}</span>
          </div>
          <div className="table-cell table-order-td w-1/2">
            {t(
              `profile.orders.cartOrder.orderType.${orderData.delivery_method}`
            )}
          </div>
        </div>
        <div className="table-row">
          <div className="table-cell table-order-th">
            <span>{t("profile.orders.cartOrder.orderDate")}</span>
          </div>
          <div className="table-cell table-order-td w-1/2">
            {orderData.created_at}
          </div>
        </div>
        <div className="table-row">
          <div className="table-cell table-order-th">
            <span>{t("profile.orders.cartOrder.totalPrice")}</span>
          </div>
          <div className="table-cell table-order-td w-1/2 font-medium font-mono">
            {numberSpacing(orderData.items.total_price)} {t("common.currency")}
          </div>
        </div>
        <div className="table-row">
          <div className="table-cell table-order-th">
            <span>{t("profile.orders.cartOrder.paymentType")}</span>
          </div>
          <div className="table-cell table-order-td w-1/2">
            {orderData.payment_type.name}
          </div>
        </div>
        <div className="table-row">
          <div className="table-cell table-order-th">
            <span>{t("profile.orders.cartOrder.phone")}</span>
          </div>
          <div className="table-cell table-order-td w-1/2">
            {orderData.user.phone}
          </div>
        </div>
        <div className="table-row">
          <div className="table-cell table-order-th">
            <span>{t("profile.orders.cartOrder.userGet")}</span>
          </div>
          <div className="table-cell table-order-td w-1/2">
            {orderData.user.name}
          </div>
        </div>
      </div>
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:no-underline">
              {data?.items.length} {t("profile.orders.cartOrder.product")}
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <div className="flex flex-col gap-4">
                {data &&
                  data.items.map(
                    (item: ProductSaleInfoProps, index: number) => (
                      <div>
                        <div className="flex gap-5 h-full" key={index + "sda"}>
                          <div className="relative rounded-2xl w-[80px] h-[80px] overflow-hidden flex-shrink-0">
                            <div className="overlay"></div>
                            <img
                              src={
                                item.images.filter((item) => !item.is_video)[0]
                                  .image_path
                              }
                              alt="images"
                              width={80}
                              height={80}
                              className="!object-contain opacity-100 w-full h-full mix-blend-multiply card-image duration-300 inset-4"
                            />
                          </div>
                          <div className="flex flex-col gap-1 w-full">
                            <h1 className="text-xs">{item.name}</h1>
                            <div className="flex flex-col">
                              <div className="flex gap-1 text-xs">
                                <span>
                                  {t("profile.orders.cartOrder.totalOrder")}:
                                </span>
                                <span className={`font-mono text-xs`}>
                                  {item.quantity}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex gap-1 text-xs">
                                <span>
                                  {t("profile.orders.cartOrder.price")}:
                                </span>
                                <span className={`font-mono text-xs`}>
                                  {numberSpacing(item.total_price)}{" "}
                                  {t("common.currency")}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="h-auto bg-transparent flex flex-col justify-between items-end">
                            <div className="text-xs">
                              {t(
                                `profile.orders.statusOrders.${orderData.status}`
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end pb-2">
                          {orderData.status === "delivered" && (
                            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                              <SheetTrigger
                                onClick={() => {
                                  form.setValue("product_id", item.id);
                                  setOpenSheet(true);
                                }}
                                className="text-nowrap text-xs"
                              >
                                {t("profile.orders.cartOrder.sendReview")}
                              </SheetTrigger>
                              <SheetContent className="bg-white w-full">
                                <SheetHeader>
                                  <SheetTitle>
                                    {t(
                                      "profile.orders.cartOrder.comment.title"
                                    )}
                                  </SheetTitle>
                                </SheetHeader>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                  <div>
                                    <div>
                                      {t(
                                        "profile.orders.cartOrder.comment.rating"
                                      )}
                                      <div className="w-full flex justify-center">
                                        <Rating
                                          className="text-4xl"
                                          emptySymbol={
                                            <IoStar color="#DEE0E5" />
                                          }
                                          fullSymbol={
                                            <IoStar color="#FFB54C" />
                                          }
                                          initialRating={form.watch().rating}
                                          onChange={(e) => {
                                            form.setValue("rating", e);
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <div>
                                        {t(
                                          "profile.orders.cartOrder.comment.comm"
                                        )}
                                      </div>
                                      <div>
                                        <Textarea
                                          value={form.watch().description}
                                          {...form.register("description", {
                                            setValueAs: (value) => value,
                                          })}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <SheetFooter>
                                    <Button
                                      disabled={
                                        form.formState.isValid ? false : true
                                      }
                                      className="w-full mt-7"
                                    >
                                      {loading ? (
                                        <span className="loader !w-5 !h-5"></span>
                                      ) : (
                                        t(
                                          "profile.orders.cartOrder.comment.sendComment"
                                        )
                                      )}
                                    </Button>
                                  </SheetFooter>
                                </form>
                              </SheetContent>
                            </Sheet>
                          )}
                        </div>
                      </div>
                    )
                  )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {(orderData.status === "created" || orderData.status === "ordered") && (
        <div className="mt-3 flex gap-2 justify-end">
          {orderData.payment_type.id !== 1 && orderData.payment_status === "unpaid" && (
            <Button
              onClick={() => {
                setPaymentModal(true);
              }}
              className="bg-[#039855] !py-2 px-3 !h-8 !text-sm hover:text-white hover:bg-[#039855]"
            >
              {t("common.paymentAction.button")}
            </Button>
          )}
          {(orderData.status === "created" ||
            orderData.status === "ordered") && (
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  variant={"ghost"}
                  className="bg-[#F13637] !py-2 px-3 !h-8 !text-sm hover:text-white hover:bg-[#F13637]/80 text-white"
                >
                  {t("common.btn.cancel")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("common.cancelAction.actionTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("common.cancelAction.actionDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("common.btn.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => cancelOrder(orderData.id)}>
                    {t("common.btn.send")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}

      <PaymentDialog
        open={paymentModal}
        paymentProps={{
          id: orderData.id,
          payment_status: orderData.payment_type.id.toString(),
        }}
      />
    </div>
  );
};

export default OrdersCard;
