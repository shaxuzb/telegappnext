import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchBarSlice {
  searchBar: boolean;
  filterBar: boolean;
  filterModal: boolean;
}

const initialState: SearchBarSlice = {
  searchBar: true,
  filterBar: false,
  filterModal: false,
};

const searchBarSlice = createSlice({
  name: "searchBar",
  initialState,
  reducers: {
    setHideSearch: (state, action: PayloadAction<Partial<SearchBarSlice>>) => {
      if (action.payload.searchBar !== undefined) {
        state.searchBar = action.payload.searchBar;
      }
    },
    setShowFilter: (state, action: PayloadAction<Partial<SearchBarSlice>>) => {
      if (action.payload.filterBar !== undefined) {
        state.filterBar = action.payload.filterBar;
      }
    },
    setModalFilter: (state, action: PayloadAction<Partial<SearchBarSlice>>) => {
      if (action.payload.filterModal !== undefined) {
        state.filterModal = action.payload.filterModal;
      }
    },
  },
});

export const { setHideSearch, setShowFilter, setModalFilter } = searchBarSlice.actions;
export default searchBarSlice.reducer;
