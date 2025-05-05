import { Layout } from "./components/Layout.ts";

export default function Index() {
  return /*html*/ `
    ${Layout.start({ script: "/index.ts", title: "Home" })}
        <h1>Index page</h1>
    ${Layout.end()}
    `;
}
