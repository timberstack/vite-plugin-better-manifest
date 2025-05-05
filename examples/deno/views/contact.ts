import { Layout } from "./components/Layout.ts";

export default function () {
  return /*html*/ `
    ${Layout.start({ script: "/contact.ts", title: "Contact" })}
        <h1>Contact page</h1>
    ${Layout.end()}
    `;
}
