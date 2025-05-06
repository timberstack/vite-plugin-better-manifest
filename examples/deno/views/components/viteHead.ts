import { betterManifest, isProd } from "../../index.ts";

export const ViteHead = (script: string) => {
  if (!script) return;

  const devScripts = /*html*/ `
        <script type="module" src="http://localhost:5173/@vite/client"></script>
        <script type="module" src="http://localhost:5173${script}"></script>
    `;

  return isProd ? betterManifest[script] : devScripts;
};
