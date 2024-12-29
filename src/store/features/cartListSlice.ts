import { ProductSaleProps } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for a favourite item

// Define the type for the initial state
type CardListState = ProductSaleProps[];

// Initial state
const initialState: CardListState = [];

const cartListSlice = createSlice({
  name: "cartList",
  initialState,
  reducers: {
    setAddCartList: (state, action: PayloadAction<ProductSaleProps>) => {
      const existingItem = state.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );
      if (existingItem) {
        const updatedCartList = state.map((item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        localStorage.setItem("cart-list", JSON.stringify(updatedCartList));
        return updatedCartList;
      } else {
        const updatedCartList = [...state, { ...action.payload, quantity: 1 }];
        localStorage.setItem("cart-list", JSON.stringify(updatedCartList));
        return updatedCartList;
      }
    },
    setIncrementCartList: (state, action: PayloadAction<ProductSaleProps>) => {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        const updatedCartList = state.map((item) =>
          item.quantity !== 1 &&
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        localStorage.setItem("cart-list", JSON.stringify(updatedCartList));
        return updatedCartList;
      }
    },
    setRemoveCartList: (state, action: PayloadAction<ProductSaleProps>) => {
      const updatedCartList = state.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
          )
      );
      localStorage.setItem("cart-list", JSON.stringify(updatedCartList));
      return updatedCartList;
    },
    hydrateCardList: (_, action: PayloadAction<CardListState>) => {
      return action.payload;
    },
  },
});

export const {
  setAddCartList,
  setRemoveCartList,
  hydrateCardList,
  setIncrementCartList,
} = cartListSlice.actions;

export default cartListSlice.reducer;
