import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    ViteImageOptimizer({
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
});
