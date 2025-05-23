# Better Manifest

Vite plugin for an easier backend integration. Please read first the official [documentation](https://vite.dev/guide/backend-integration).

## Usage

```
npm install @timberstack/vite-plugin-better-manifest
pnpm install @timberstack/vite-plugin-better-manifest
deno install npm:@timberstack/vite-plugin-better-manifest
```

```javascript
// vite.config.{ts, js}
import { defineConfig } from "vite";
import BetterManifest from "@timberstack/vite-plugin-better-manifest";

export default defineConfig({
  plugins: [BetterManifest()],
});
```

## Options
```javascript
// exemplified with the defaults
BetterManifest({
    resourcesDir: "/resources", // will set vite root option
    tsBuildTarget: "esnext", // build target in case you're using typescript
    publicDir: "/public" // your public folder, used as output directory for vite's generated assets folder
})
```

## The problem

While vite's backend integration docs is **amazing**, things can get pretty boilerplate-ish. This is fine, you can get your way out of it with just a couple of minutes of copy/paste. However, the real problem comes when it's time to build for production.

The official documentation provides a sort of pseudo code for explaining how to use the generated `manifest.json` for building your final HTML with the corresponding links. Personally, I find this a bit confusing and hard to get it right (and that's why there are already so many [integrations](https://github.com/vitejs/awesome-vite#integrations-with-backends) already).

## The solution

Better Manifest does a couple of interesting things:

### Dev mode

It provides the initial configuration needed for the integration to work. Under the hood, it's setting the initial options needed for making use of your assets in the most organic way possible. It sets the vite root to your desired resources folder (by default `/resources`) so they can be accessed directly from there, as if it was your regular public directory.

### Going to prod

When it comes to building, it outputs the generated `assets` folder to your public directory and the `.vite` folder to the root of your project. Inside the `.vite` folder you will find the original `manifest.json` together with a `better-manifest.json`. For the input, it utilizes all the files found in your vite root folder (by default `/resources`).

Given the following project structure:

```bash
├── public
│   └── favicon.ico # will be preserved
├── resources
│   ├── css
│   │   ├── contact.css
│   │   └── index.css
│   ├── ts
│   │   ├── dynamic.ts
│   │   └── noEntry.ts
│   ├── contact.ts # added to rollup input options
│   └── index.ts # added to rollup input options
```

When running `vite build`, your project will look like this:

```bash
├── .vite # Generated by vite, but moved by the plugin
│   ├── better-manifest.json # This is the real deal
│   └── manifest.json
├── public
│   ├── favicon.ico
│   └── assets # Generated by vite
│       ├── contact-CaP_4Zek.css
│       ├── contact-CZqaBrwj.js
│       ├── dynamic-BSHE5Y3H.js
│       ├── index-CD-sq4b9.js
│       ├── index-DdZIYClp.js
│       └── index-W1erjkBN.css
├── resources
│   # ...
```

The `.vite/better-manifest.json` file has the following content:

```json
{
  "/contact.ts": "<link rel=\"stylesheet\" href=\"/assets/contact-CaP_4Zek.css\" />\n<script type=\"module\" src=\"/assets/contact-CZqaBrwj.js\"></script>",
  "/index.ts": "<link rel=\"stylesheet\" href=\"/assets/index-W1erjkBN.css\" />\n<script type=\"module\" src=\"/assets/index-CD-sq4b9.js\"></script>"
}
```

So, when going to production, you just grab the original file name from `better-manifest.json` and you will have the pre-generated string tags.

It's kind of a plug and play: register the plugin, grab any of the `ViteHead` components from the [`examples`](/vite-plugin-better-manifest/examples) directory and start using your assets served by vite either in dev or prod mode.

### Suggested usage

Here's an implementation in javascript on how the vite head component should look like:

```javascript
import { readFileSync } from "node:fs";

const isProd = Deno.env.get("PROD");

// parsing the manifest
let betterManifest;

if (isProd) {
    try {
        betterManifest = JSON.parse(
            readFileSync("../../.vite/better-manifest.json", { encoding: "utf-8" })
        )
    } catch (_) {
        if (isProd) console.log("Manifest not found. Run the build command.");
    }
}


// Vite Head component
export const ViteHead = (script: string) => {
  if (!script) return;

  const devScripts = /*html*/ `
        <script type="module" src="http://localhost:5173/@vite/client"></script>
        <script type="module" src="http://localhost:5173${script}"></script>
    `;

  return isProd ? betterManifest[script] : devScripts;
};


// ... somewhere in your code
ViteHead("/index.ts")
```

Few things to notice:
- You can, of course, move the parsing of the manifest to wherever you feel like (maybe the entry point of your application).
- The expected script name should start with `/` and be relative to your **vite root**. `/index.ts` will produce the following url `http://localhost:5173/index.ts`, and it works because the root is set to the `/resources` folder. If the root of vite was set to the project's directory (**not recommended**), you should pass the file name with the corresponding prefix (`/resources/index.ts`).

## License
MIT
