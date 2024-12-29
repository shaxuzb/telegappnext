import React from "react";
import { Input } from "../ui/input";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";
interface SearchInputProps {
  readonly?: boolean;
  value?: string;
  onChange?: (e: any) => void;
}
const SearchInput: React.FC<SearchInputProps> = (props) => {
  const {t} = useTranslation()
  const { readonly = false, value, onChange } = props;
  return (
    <div className="relative w-full">
      <div className="absolute top-1/2 -translate-y-1/2 left-3 ">
        <FaSearch color="#2F3037" strokeWidth="0px" fontSize="16px" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        readOnly={readonly}
        className="pl-10 text-sm border-none !outline-none !ring-0 focus:!outline-none focus-within:outline-none focus-visible:!outline-none bg-[#dee0e5]"
        placeholder={t("common.placeholderSearch")}
      />
    </div>
  );
};

export default SearchInput;
