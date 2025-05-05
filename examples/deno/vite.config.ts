import { defineConfig } from "vite";
import { importsPlugin } from "@timberstack/vite-plugin-better-manifest";

export default defineConfig({
  plugins: [importsPlugin()],
});
