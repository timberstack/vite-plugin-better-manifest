import { serveDir } from "@std/http/file-server";
import { viteDevServer } from "./viteServer.ts";

export const isProd = Deno.env.get("PROD");
export let betterManifest: { [key: string]: string };

if (isProd) {
  try {
    const decoder = new TextDecoder("utf-8");
    const manifest = Deno.readFileSync(
      `${Deno.cwd()}/.vite/better-manifest.json`,
    );
    betterManifest = JSON.parse(decoder.decode(manifest));
  } catch (_) {
    console.log("Manifest not found. Run the build command.");
  }
} else {
  await viteDevServer();
}

Deno.serve(async (req) => {
  const pathname = new URL(req.url).pathname;

  if (pathname.startsWith("/assets")) {
    return serveDir(req, {
      fsRoot: "public",
    });
  }

  let page;
  try {
    page = (await import(
      `./views/${pathname === "/" ? "index" : pathname.slice(1)}.ts`
    ))
      .default;
  } catch (_) {
    page = (await import(`./views/404.ts`))
      .default;
  }

  return new Response(page(), {
    headers: {
      "Content-Type": "html",
    },
  });
});
