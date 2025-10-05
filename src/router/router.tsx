import { createBrowserRouter, Navigate, Outlet, RouteObject } from "react-router-dom";
import Error from "@/components/Error";
import NotFound from "@/components/NotFound";
import ShopClosed from "@/components/ShopClosed";
import UserNotFound from "@/components/UserNotFound";
import LangLayout from "@/layouts/LangLayout";
import MainLayout from "@/layouts/MainLayout";
import CartList from "@/pages/cart-list/CartList";
import CheckOut from "@/pages/cart-list/checkout/CheckOut";
import Catalog from "@/pages/catalog/Catalog";
import Favourite from "@/pages/favorites/Favourite";
import Home from "@/pages/home/Home";
import Product from "@/pages/product/Product";
import ProductDetail from "@/pages/product/ProductDetail";
import ProductMenu from "@/pages/product/ProductMenu";
import ProductReview from "@/pages/product/ProductReview";
import MapAddress from "@/pages/profile/map/MapAddress";
import MapGet from "@/pages/profile/map/MapGet";
import Orders from "@/pages/profile/orders/Orders";
import Profile from "@/pages/profile/Profile";

const routes: RouteObject[] = [
  // 🟢 Root redirect qo‘shildi
  {
    path: "/",
    element: <Navigate to="/uz" replace />,
  },
  {
    path: "/:lang",
    element: <LangLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "product/all", element: <Product /> },
          { path: "product/menu/:menuId", element: <ProductMenu /> },
          { path: "product/sale", element: <Product /> },
          { path: "catalog/category/:id", element: <Product /> },
          { path: "product/:id", element: <ProductDetail /> },
          { path: "product/review/:id", element: <ProductReview /> },
          { path: "catalog", element: <Catalog /> },
          { path: "favorites", element: <Favourite /> },
          { path: "cart-list", element: <CartList /> },
          {
            path: "profile",
            element: <Outlet />,
            children: [
              { index: true, element: <Profile /> },
              { path: "orders", element: <Orders /> },
              {
                path: "map",
                element: <MapAddress />,
                children: [{ path: ":id", element: <MapAddress /> }],
              },
              { path: "map/get", element: <MapGet /> },
            ],
          },
          { path: "checkout", element: <CheckOut /> },
        ],
      },
      { path: "shop-closed", element: <ShopClosed /> },
      { path: "error", element: <Error /> },
      { path: "user-notfound", element: <UserNotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});
