import { serveDir } from "@std/http/file-server";
import { viteDevServer } from "./viteServer.ts";

const isProd = Deno.env.get("PROD");
if (!isProd) await viteDevServer();

Deno.serve(async (req) => {
  const pathname = new URL(req.url).pathname;

  if (pathname.startsWith("/assets")) {
    return serveDir(req, {
      fsRoot: "public",
      urlRoot: "",
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
