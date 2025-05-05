import { build, createServer } from "vite";

const arg = Deno.args.at(-1);

export const viteDevServer = async () => {
  const server = await createServer();
  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
};

if (import.meta.main) {
  if (arg === "dev") {
    await viteDevServer();
  } else {
    await build();
  }
}
