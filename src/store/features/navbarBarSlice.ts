import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = true;

const navbarBarSlice = createSlice({
  name: "searchBar",
  initialState,
  reducers: {
    setHideNav: (state, action: PayloadAction<boolean>) => {
      return state = action.payload;
    },
  },
});

export const { setHideNav } = navbarBarSlice.actions;
export default navbarBarSlice.reducer;
