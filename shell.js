import "./modulepreload-polyfill-DvzacyrX.js";
import { C as f, a as E } from "./oauth-Ko-x6OSf.js";
import { S as p, a as w, g as S, d as L, i as u, h as _, f as P, e as C, b as A } from "./logger-CEZ4NzCb.js";
const { consentGranted: I, required: b } = R();
function R() {
  const s = window.glue?.CookieNotificationBar, l = (t) => {
    if (!t?.instance) return Promise.resolve();
    const n = t.status.ACCEPTED;
    return t.instance.status === n ? Promise.resolve() : new Promise((a) => {
      t.instance.listen("loaded", (r) => {
        r.detail.status === n && a();
      }), t.instance.listen("statuschange", (r) => {
        r.detail.status === n && a();
      });
    });
  }, i = (t) => t?.instance ? new Promise((n) => {
    let a = !1;
    const r = (e) => {
      a || (a = !0, n(e));
    };
    t.instance.listen("loaded", (e) => {
      r(e.detail.required === !0 && e.detail.eea !== !0);
    }), requestAnimationFrame(() => {
      if (a) return;
      const e = document.querySelector(
        ".glue-cookie-notification-bar-control"
      );
      e && !e.hasAttribute("aria-hidden") && r(!0);
    });
  }) : Promise.resolve(!1);
  if (s?.instance)
    return {
      consentGranted: l(s),
      required: i(s)
    };
  if (document.querySelector('script[src*="cookienotificationbar"]')) {
    let t, n;
    const a = new Promise((e) => {
      t = e;
    }), r = new Promise((e) => {
      n = e;
    });
    return window.glueCookieNotificationBarLoaded = () => {
      const e = window.glue?.CookieNotificationBar;
      e ? (l(e).then(t), i(e).then(n)) : (t(), n(!1));
    }, { consentGranted: a, required: r };
  }
  return {
    consentGranted: Promise.resolve(),
    required: Promise.resolve(!1)
  };
}
B();
G();
function B() {
  const s = document.getElementById("turndown-banner"), l = document.getElementById("banner-dismiss-button");
  if (!s) return;
  const i = new URLSearchParams(window.location.search);
  if (f.SHELL_PREFIX === "/_gemini" || i.get("share_surface") === "gemini" || i.get("turndown_banner") === "false" || i.get("opal_turndown_banner") === "false") {
    s.hidden = !0;
    return;
  }
  l?.addEventListener("click", () => {
    s.hidden = !0;
  });
}
async function G() {
  const s = f.SHELL_GUEST_ORIGIN;
  if (!s || s === "*")
    return;
  const l = document.querySelector("iframe#opal-app");
  if (!l?.contentWindow) {
    console.error("Could not find #opal-app iframe");
    return;
  }
  const i = "Shell Host", t = f.SHELL_PREFIX, n = new URL(window.location.href), a = t && (n.pathname === t || n.pathname.startsWith(`${t}/`)) ? n.pathname.slice(t.length) : n.pathname, r = new URL(
    "_app" + a + n.search + n.hash,
    s
  );
  r.searchParams.set(p, window.location.origin), l.src = r.href;
  let e;
  if (f.FAKE_MODE) {
    const { FakeModeOpalShell: o } = await import("./fake-mode-opal-shell-Cxuz4Jan.js");
    e = new o();
  } else {
    const o = new w();
    e = o, I.then(() => o.enableAnalytics()), o.cookieBarRequired = b;
  }
  const c = {}, d = S();
  window.addEventListener("message", (o) => {
    if (o.isTrusted && o.source === l.contentWindow && o.origin === s && typeof o.data == "object" && o.data !== null && o.data.type === L) {
      d.log(
        u(
          "Received establish MessageChannel request from",
          o.origin
        ),
        i
      ), c.value ? (d.log(
        u(
          "Discarding previous guest, iframe must have navigated"
        ),
        i
      ), c.value.guest[_](), c.value.port.close()) : E(
        (h) => (
          // Note we box the guest so that this callback doesn't need to be
          // re-attached when the guest is replaced due to navigation.
          c.value?.guest.receiveFromEmbedder(h)
        )
      ), d.log(
        u(
          "Sending establish MessageChannel response"
        ),
        i
      );
      const m = o.ports[0];
      m.postMessage({ type: P }), d.log(u("Exposing host API"), i), C(e, m), d.log(
        u("Connecting to guest API"),
        i
      );
      const g = A(m);
      c.value = { port: m, guest: g };
    }
  });
}
