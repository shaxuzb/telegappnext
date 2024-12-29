import { Badge } from "@/components/ui/badge";
import { statusOrder } from "@/shared/variantsStatus";
import { clsx, type ClassValue } from "clsx";
import { t } from "i18next";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function numberSpacing(item: number) {
  return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function avatarLetter(item: string) {
  const letter = item.split(" ");
  return letter[0].slice(0, 1) + letter[1].slice(0, 1);
}

export function statusOrdered(code:string){
  const filteredStatus = statusOrder.find(item => item.code === code);
  return(
    <Badge style={{backgroundColor: filteredStatus.color}} variant="default">
      {t(filteredStatus.label)}
    </Badge>
  )
}