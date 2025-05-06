import { createServer } from "vite";

export const viteDevServer = async () => {
  const server = await createServer();
  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
};
