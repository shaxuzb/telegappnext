import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { closest } from "color-2-name";
import { FaCheckCircle } from "react-icons/fa";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { useParams, useSearchParams } from "react-router-dom";
import { FilterOptionProps } from "@/types";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setModalFilter } from "@/store/features/searchBarSlice";
import { useTranslation } from "react-i18next";
import { Badge } from "../ui/badge";
const Filter = () => {
  const { t } = useTranslation();
  const params = useParams();
  const dispatch = useAppDispatch();
  const [queryParams, setQueryParams] = useSearchParams();
  const [colors, setColors] = useState<string[]>(
    queryParams.get("colors") ? [queryParams.get("colors")] : []
  );
  const [sizes, setSizes] = useState<string[]>(
    queryParams.get("sizes") ? [queryParams.get("sizes")] : []
  );
  const [priceMin, setPriceMin] = useState<number | any>();
  const [priceMax, setPriceMax] = useState<number | any>();
  const axiosPrivate = useAxios();
  const { data } = useQuery({
    queryKey: ["FilterOption"],
    queryFn: async () => {
      const { data } = await axiosPrivate.get<FilterOptionProps>(
        params.id
          ? `/products/getfilteroptions/${params.id}`
          : params.menuId
          ? `/products/getfiltermenuroptions/${params.menuId}`
          : "/products/getfilteroptions/all"
      );
      return data && data;
    },
  });
  const handleAdd = (code: string, item: any) => {
    if (code === "color") {
      setColors((prev) => [...prev, item]);
    } else {
      setSizes((prev) => [...prev, item]);
    }
  };
  const handleRemove = (code: string, item: any) => {
    if (code === "color") {
      const filter = colors.filter((colorItem) => colorItem !== item);
      setColors(filter);
    } else {
      const filter = sizes.filter((sizeItem) => sizeItem !== item);
      setSizes(filter);
    }
  };
  // const handleClearFilter = ()=>{
  //   if()
  // }
  const handleFilter = () => {
    Array.from(queryParams.keys()).forEach((key) => {
      if (key.startsWith("colors") || key.startsWith("sizes")) {
        queryParams.delete(key);
      }
    });
    const minPrice =
      priceMin !== ""
        ? priceMin < data.price_range.min
          ? data.price_range.min
          : priceMin
        : data.price_range.min;

    const maxPrice =
      priceMax !== ""
        ? priceMax > data.price_range.max
          ? data.price_range.max
          : priceMax
        : data.price_range.max;

    // Auto-adjust if one is missing
    const finalMin = priceMin === "" ? data.price_range.min : minPrice;
    const finalMax = priceMax === "" ? data.price_range.max : maxPrice;
    colors.forEach((item, index) => {
      queryParams.set(`colors[${index}]`, item);
    });

    sizes.forEach((item, index) => {
      queryParams.set(`sizes[${index}]`, item);
    });
    if (finalMin || finalMax) {
      queryParams.set("min", finalMin);
      queryParams.set("max", finalMax);
    }
    setQueryParams(queryParams);
    dispatch(setModalFilter({ filterModal: false }));
  };
  useEffect(() => {
    // Load existing colors and sizes from query parameters
    const queryColors = [];
    const querySizes = [];

    // Iterate through searchParams to extract colors and sizes
    queryParams.forEach((value, key) => {
      if (key.startsWith("colors")) {
        queryColors.push(value);
      } else if (key.startsWith("sizes")) {
        querySizes.push(value);
      }
    });
    if (queryParams.get("min")) {
      setPriceMin(queryParams.get("min"));
    }
    if (queryParams.get("max")) {
      setPriceMax(queryParams.get("max"));
    }
    setColors(queryColors);
    setSizes(querySizes);
  }, [queryParams]);
  return (
    <SheetContent className="bg-white w-screen">
      <SheetHeader>
        <SheetTitle>{t("filter.title")}</SheetTitle>
        <SheetDescription hidden></SheetDescription>
        {data && (
          <div>
            <div>
              <div>{}</div>
            </div>
            <div className="flex justify-start py-3">
              <div>
                <p className="w-full text-left mb-1">
                  {t("filter.price.title")}
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Label className="absolute top-1/2 -translate-y-1/2 left-3 font-mono text-[#A8ABB4] font-normal">
                      {t("filter.price.min")}
                    </Label>
                    <Input
                      type="number"
                      value={priceMin}
                      onChange={(e) => {
                        setPriceMin(e.target.value);
                      }}
                      placeholder={`${data.price_range.min}`}
                      className="pl-10 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Label className="absolute top-1/2 -translate-y-1/2 left-3 font-mono text-[#A8ABB4] font-normal">
                      {t("filter.price.max")}
                    </Label>
                    <Input
                      value={priceMax}
                      onChange={(e) => {
                        setPriceMax(e.target.value);
                      }}
                      type="number"
                      placeholder={`${data.price_range.max}`}
                      className="pl-14 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Drawer>
              <DrawerTrigger className="justify-start w-full flex">
                <div className="w-full relative">
                  <div
                    className={`flex justify-start !w-full border-t py-3 ${
                      colors.length > 0 && "pb-5"
                    }`}
                  >
                    {t("filter.colors.select")}
                  </div>
                  {colors.length > 0 && (
                    <div className="absolute bottom-1 text-xs w-full flex gap-1  justify-start line-clamp-1 pr-2 text-ellipsis">
                      {colors.map((item, index) => (
                        <Badge key={index} className="py-0 px-1 !bg-slate-400">
                          {closest(item).name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </DrawerTrigger>
              <DrawerContent className="bg-white h-3/4">
                <DrawerHeader>
                  <DrawerTitle>{t("filter.colors.select")}</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col gap-1 px-3 overflow-y-scroll">
                  {data.colors.map((item, index: number) => (
                    <div
                      key={index}
                      className="flex items-center cursor-pointer gap-4"
                      onClick={() => {
                        if (colors.some((items) => items === item)) {
                          handleRemove("color", item);
                        } else {
                          handleAdd("color", item);
                        }
                      }}
                    >
                      <div
                        className={`w-10 !h-10 rounded-full aspect-square overflow-hidden shadow flex justify-center items-center`}
                        style={{
                          backgroundColor: item,
                        }}
                      >
                        {colors.some((items) => items === item) && (
                          <FaCheckCircle className="text-white bg-black border rounded-full" />
                        )}
                      </div>
                      <div className="border-b w-full py-2">
                        {t("filter.colors.colorName", {
                          colorName: closest(item).name,
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <DrawerFooter className="py-1 pb-3">
                  <DrawerClose className="w-full bg-ring text-white !py-2 rounded-lg">
                    {t("common.btn.apply")}
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Drawer>
              <DrawerTrigger className="relative justify-start w-full flex">
                <div
                  className={`flex justify-start w-full border-t py-3 ${
                    sizes.length > 0 && "pb-5"
                  }`}
                >
                  {t("filter.sizes.select")}
                </div>
                {sizes.length > 0 && (
                  <div className="absolute bottom-1 text-xs w-full flex gap-1 justify-start line-clamp-1">
                    {sizes.map((item, index) => (
                      <Badge key={index} className="py-0 px-1 !bg-slate-400">
                        {item}
                      </Badge>
                    ))}
                  </div>
                )}
              </DrawerTrigger>
              <DrawerContent className="bg-white h-3/4">
                <DrawerHeader>
                  <DrawerTitle> {t("filter.sizes.select")}</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col gap-1 px-3">
                  {data.sizes.map((item) => (
                    <div key={item}>
                      <Label className="flex items-center cursor-pointer gap-4">
                        <div
                          className={`w-10 h-10 rounded-full  flex justify-center items-center`}
                          style={{
                            backgroundColor: item,
                          }}
                        >
                          <Checkbox
                            checked={sizes.some((items) => items === item)}
                            onClick={() => {
                              if (sizes.some((items) => items === item)) {
                                handleRemove("size", item);
                              } else {
                                handleAdd("size", item);
                              }
                            }}
                          />
                        </div>
                        <div className="border-b w-full py-2">{item}</div>
                      </Label>
                    </div>
                  ))}
                </div>

                <DrawerFooter>
                  <DrawerClose className="w-full bg-ring text-white !py-2 rounded-lg">
                    {t("common.btn.apply")}
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        )}
      </SheetHeader>
      <SheetFooter className="mt-6">
        <Button onClick={handleFilter}>{t("common.btn.watch")}</Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default Filter;
