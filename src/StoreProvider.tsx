"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./store/store";

interface StoreProviderProps {
  children: React.ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Lazily initialize the store once
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
