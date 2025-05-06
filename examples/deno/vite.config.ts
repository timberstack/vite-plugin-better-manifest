import { defineConfig } from "vite";
import BetterManifest from "@timberstack/vite-plugin-better-manifest";

export default defineConfig({
  plugins: [BetterManifest()],
});
