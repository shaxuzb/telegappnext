import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useAxios from "@/hooks/useAxios";
import { PaymentProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
interface PaymentDialogProps {
  open: boolean;
  paymentProps: PaymentProps;
}
const PaymentDialog = (props: PaymentDialogProps) => {
  const {t}= useTranslation()
  const { open = false, paymentProps } = props;
  const axiosPrivate = useAxios();
  const navigate = useNavigate();
  const { isFetching, isLoading, data } = useQuery({
    queryKey: ["payment"],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(
        `/${
          paymentProps.payment_status === "2" ? "payme" : "clickuz"
        }/generaterul/${paymentProps.id}`
      );
      return data;
    },
    enabled: !!paymentProps.id,
    retry: false,
  });
  return (
    <div>
      <AlertDialog open={open} onOpenChange={() => {}}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("common.paymentAction.actionTitle",{
                paymentId:paymentProps.id
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
             {t("common.paymentAction.actionDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isFetching || (isLoading && true)}
              onClick={() => navigate(`/profile/orders?orderId=${paymentProps.id}`)}
            >
             {t("common.btn.continue")}
            </AlertDialogCancel>
            <AlertDialogAction disabled={isFetching || (isLoading && true)}
                onClick={() => {
                    window.open(data.url);
                    navigate(`/profile/orders?orderId=${paymentProps.id}`)
                }}
            >
              {t("common.btn.pay")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaymentDialog;
