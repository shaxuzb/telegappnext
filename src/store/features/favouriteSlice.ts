import { ProductSaleProps } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for a favourite item


// Define the type for the initial state
type FavouriteState = ProductSaleProps[];

// Initial state
const initialState: FavouriteState = [];

const favouriteSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    setAddFavourite: (state, action: PayloadAction<ProductSaleProps>) => {
      const updatedFavourites = [...state, action.payload];
      localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
      return updatedFavourites;
    },
    // Action to remove a favourite
    setRemoveFavourite: (state, action: PayloadAction<{ id: number }>) => {
      const updatedFavourites = state.filter(
        (item) => item.id !== action.payload.id
      );
      localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
      return updatedFavourites;
    },
    // Action to hydrate favourites from localStorage
    hydrateFavourites: (_, action: PayloadAction<FavouriteState>) => {
      return action.payload;
    },
  },
});

export const { setAddFavourite, setRemoveFavourite, hydrateFavourites } =
  favouriteSlice.actions;

export default favouriteSlice.reducer;
