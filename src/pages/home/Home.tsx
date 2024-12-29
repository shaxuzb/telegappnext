"use client";

import { TelegPage } from "@/components/TelegPage";
import HomeSlider from "./components/HomeSlider";
import Product from "./Product";

export default function Home() {
  return (
    <TelegPage back={false}>
      <div className="font-[family-name:var(--font-geist-sans)] mt-3">
        <HomeSlider />
        <div className="px-3">
          <Product />
        </div>
      </div>
    </TelegPage>
  );
}
