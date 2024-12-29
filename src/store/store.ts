import { configureStore } from "@reduxjs/toolkit";
import favouriteReducer from "./features/favouriteSlice";
import cartListReducer from "./features/cartListSlice";
import searchBarReducer from "./features/searchBarSlice";
import navBarReducer from "./features/navbarBarSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      favourites: favouriteReducer,
      cartList: cartListReducer,
      searchBarHide: searchBarReducer,
      navBarHide: navBarReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
