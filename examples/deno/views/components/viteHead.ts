const isProd = Deno.env.get("PROD");
let betterManifest: { [key: string]: string };
try {
  betterManifest = (await import("../../.vite/better-manifest.json", {
    with: { type: "json" },
  })).default;
} catch (_) {
  console.log("Manifest not found. Try building.");
}

export const ViteHead = (script: string) => {
  if (!script) return;

  const devScripts = /*html*/ `
        <script type="module" src="http://localhost:5173/@vite/client"></script>
        <script type="module" src="http://localhost:5173${script}"></script>
    `;

  return /*html*/ `
          ${isProd ? betterManifest[script] : devScripts}
    `;
};
