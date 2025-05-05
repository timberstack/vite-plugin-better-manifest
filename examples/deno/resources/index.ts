import "./css/index.css";

console.log("working from index page");
const h2 = document.createElement("h2");
h2.textContent = "Created with JS";
document.body.appendChild(h2);

const { hello } = await import("./ts/dynamic.ts");
console.log(hello);
