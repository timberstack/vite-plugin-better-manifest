import { Layout } from "./components/Layout.ts";

export default function () {
  return /*html*/ `
        ${Layout.start()}
            <h1>Not found!</h1>
        ${Layout.end()}
    `;
}
