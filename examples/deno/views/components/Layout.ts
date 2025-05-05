import { ViteHead } from "./viteHead.ts";

type LayoutProps = {
  script?: string;
  title?: string;
};

export const Layout = {
  start({ script = "", title = "No title" }: LayoutProps = {}) {
    return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title} | Vite</title>
          ${script && ViteHead(script)}
        </head>
        <body>
            <header>
                <nav>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="/contact">Contact</a>
                        </li>
                    </ul>
                </nav>
            </header>
            `;
  },
  end() {
    return /*html*/ `
     </body>
    </html>`;
  },
};
