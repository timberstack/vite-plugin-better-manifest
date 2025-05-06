const E = "modulepreload",
  v = function (c) {
    return "/" + c;
  },
  d = {},
  w = function (f, l, y) {
    let i = Promise.resolve();
    if (l && l.length > 0) {
      let o = function (e) {
        return Promise.all(
          e.map((r) =>
            Promise.resolve(r).then(
              (s) => ({ status: "fulfilled", value: s }),
              (s) => ({ status: "rejected", reason: s }),
            )
          ),
        );
      };
      document.getElementsByTagName("link");
      const t = document.querySelector("meta[property=csp-nonce]"),
        u = t?.nonce || t?.getAttribute("nonce");
      i = o(l.map((e) => {
        if (e = v(e), e in d) return;
        d[e] = !0;
        const r = e.endsWith(".css"), s = r ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${e}"]${s}`)) return;
        const n = document.createElement("link");
        if (
          n.rel = r ? "stylesheet" : E,
            r || (n.as = "script"),
            n.crossOrigin = "",
            n.href = e,
            u && n.setAttribute("nonce", u),
            document.head.appendChild(n),
            r
        ) {
          return new Promise((h, p) => {
            n.addEventListener("load", h),
              n.addEventListener(
                "error",
                () => p(new Error(`Unable to preload CSS for ${e}`)),
              );
          });
        }
      }));
    }
    function a(o) {
      const t = new Event("vite:preloadError", { cancelable: !0 });
      if (t.payload = o, window.dispatchEvent(t), !t.defaultPrevented) throw o;
    }
    return i.then((o) => {
      for (const t of o || []) t.status === "rejected" && a(t.reason);
      return f().catch(a);
    });
  };
console.log("working from index page");
const m = document.createElement("h2");
m.textContent = "Created with JS";
document.body.appendChild(m);
const { hello: g } = await w(async () => {
  const { hello: c } = await import("./dynamic-BSHE5Y3H.js");
  return { hello: c };
}, []);
console.log(g);
