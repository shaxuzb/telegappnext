import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import SearchBarModal from "./SearchBarModal";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { FaFilter } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setModalFilter } from "@/store/features/searchBarSlice";
const SearchBar = () => {
  const searchBar = useAppSelector((state) => state.searchBarHide);
  const [modalSearch, setSearchModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!searchBar.searchBar) {
      return document.body.classList.remove("pt-14");
    }
    document.body.classList.add("pt-14");

    document.body.style.overflow = modalSearch ? "hidden" : "visible";
  }, [searchBar.searchBar]);

  return (
    searchBar.searchBar && (
      <div
        className={`fixed top-0 z-[5] w-full max-w-[500px] shadow bg-[#fff] px-4 py-2 flex items-center gap-3`}
      >
        <motion.div
          animate={{ top: 0 }}
          onClick={() => setSearchModal(!modalSearch)}
          className="w-full"
        >
          <SearchInput readonly={true} />
        </motion.div>
        {searchBar.filterBar && (
          <Button
            onClick={() => {
              dispatch(setModalFilter({ filterModal: true }));
            }}
            className="p-0 px-2 bg-transparent hover:bg-transparent shadow-none"
          >
            <FaFilter color="black" />
          </Button>
        )}
        {modalSearch && (
          <SearchBarModal setModal={setSearchModal} modal={modalSearch} />
        )}
      </div>
    )
  );
};

export default SearchBar;
