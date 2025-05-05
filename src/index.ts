import type { BuildOptions, Manifest, ManifestChunk, Plugin } from "vite";
import { cwd } from "node:process";
import {
  existsSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";

/** Function copied from Vite docs */
function importedChunks(
  manifest: Manifest,
  name: string,
): ManifestChunk[] {
  const seen = new Set<string>();

  function getImportedChunks(chunk: ManifestChunk): ManifestChunk[] {
    const chunks: ManifestChunk[] = [];
    for (const file of chunk.imports ?? []) {
      const imported = manifest[file];
      if (seen.has(file)) {
        continue;
      }
      seen.add(file);

      chunks.push(...getImportedChunks(imported));
      chunks.push(imported);
    }

    return chunks;
  }

  return getImportedChunks(manifest[name]);
}

const cssLink = (cssFile: string) =>
  `<link rel="stylesheet" href="/${cssFile}" />`;
const scriptLink = (manifest: Manifest, name: string) =>
  `<script type="module" src="/${manifest[name].file}"></script>`;
const preloadLink = (chunk: ManifestChunk) =>
  `<link rel="modulepreload" href="/${chunk.file}" />`;

export const generateHeadScripts = (
  fileName: string,
  viteManifest: Manifest,
) => {
  const strings: string[] = [];

  const cssChunks = viteManifest[fileName].css ?? [];
  for (const cssFile of cssChunks) {
    strings.push(cssLink(cssFile));
  }

  for (const chunk of importedChunks(viteManifest, fileName)) {
    const cssChunks = chunk.css ?? [];

    for (const cssFile of cssChunks) {
      strings.push(cssLink(cssFile));
    }
  }
  strings.push(scriptLink(viteManifest, fileName));

  for (const chunk of importedChunks(viteManifest, fileName)) {
    strings.push(preloadLink(chunk));
  }

  return strings.join("\n");
};

export type Options = {
  resourcesDir?: string;
  buildTarget?: string;
};

export const importsPlugin = (userOptions?: Options): Plugin => {
  const { resourcesDir, buildTarget }: Options = {
    resourcesDir: "/resources",
    buildTarget: "esnext",
    ...userOptions,
  };

  const files = readdirSync(`${cwd()}${resourcesDir}`, { withFileTypes: true })
    .map((t) => ({ name: t.name, isFile: t.isFile() })).filter((
      dir,
    ) => dir.isFile);

  const entrypoints = files.map((file) => `/${file.name}`);

  const buildOptions: BuildOptions = {
    // generate .vite/manifest.json in outDir
    manifest: true,
    copyPublicDir: false,
    outDir: `${cwd()}/public`,
    emptyOutDir: false,
    target: buildTarget,

    rollupOptions: {
      input: entrypoints,
    },
  };

  let importsManifest;
  return {
    name: "file-links-map",
    config(viteConfig) {
      viteConfig.root = `${cwd()}${resourcesDir}`;
      viteConfig.build = buildOptions;
    },
    writeBundle(_, assets) {
      const manifest = assets[".vite/manifest.json"] as { source?: string };
      if (!manifest || !manifest.source) return;

      const builtHeads = entrypoints.reduce((acc, current) => {
        acc[current] = generateHeadScripts(
          current.slice(1),
          JSON.parse(manifest.source!),
        );
        return acc;
      }, {} as { [key: string]: string });

      importsManifest = builtHeads;
    },
    closeBundle() {
      try {
        rmSync(`${cwd()}${resourcesDir}/.vite`, { recursive: true });
      } catch (_) { /** */ }

      try {
        if (existsSync(`${cwd()}/.vite`)) {
          rmSync(`${cwd()}/.vite`, { recursive: true });
        }

        renameSync(`${buildOptions.outDir}/.vite`, `${cwd()}/.vite`);
        writeFileSync(
          `${cwd()}/.vite/better-manifest.json`,
          JSON.stringify(importsManifest, null, 2),
          "utf-8",
        );
      } catch (_) { /** */ }

      console.log("Build ended successfully");
    },
  };
};
