import { C as h, s as Ze, O as et } from "./oauth-Ko-x6OSf.js";
const X = (e, t) => t.some((s) => e instanceof s);
let he, ge;
function tt() {
  return he || (he = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function st() {
  return ge || (ge = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const Q = /* @__PURE__ */ new WeakMap(), j = /* @__PURE__ */ new WeakMap(), B = /* @__PURE__ */ new WeakMap();
function rt(e) {
  const t = new Promise((s, r) => {
    const o = () => {
      e.removeEventListener("success", n), e.removeEventListener("error", a);
    }, n = () => {
      s(P(e.result)), o();
    }, a = () => {
      r(e.error), o();
    };
    e.addEventListener("success", n), e.addEventListener("error", a);
  });
  return B.set(t, e), t;
}
function nt(e) {
  if (Q.has(e))
    return;
  const t = new Promise((s, r) => {
    const o = () => {
      e.removeEventListener("complete", n), e.removeEventListener("error", a), e.removeEventListener("abort", a);
    }, n = () => {
      s(), o();
    }, a = () => {
      r(e.error || new DOMException("AbortError", "AbortError")), o();
    };
    e.addEventListener("complete", n), e.addEventListener("error", a), e.addEventListener("abort", a);
  });
  Q.set(e, t);
}
let Z = {
  get(e, t, s) {
    if (e instanceof IDBTransaction) {
      if (t === "done")
        return Q.get(e);
      if (t === "store")
        return s.objectStoreNames[1] ? void 0 : s.objectStore(s.objectStoreNames[0]);
    }
    return P(e[t]);
  },
  set(e, t, s) {
    return e[t] = s, !0;
  },
  has(e, t) {
    return e instanceof IDBTransaction && (t === "done" || t === "store") ? !0 : t in e;
  }
};
function Te(e) {
  Z = e(Z);
}
function ot(e) {
  return st().includes(e) ? function(...t) {
    return e.apply(ee(this), t), P(this.request);
  } : function(...t) {
    return P(e.apply(ee(this), t));
  };
}
function at(e) {
  return typeof e == "function" ? ot(e) : (e instanceof IDBTransaction && nt(e), X(e, tt()) ? new Proxy(e, Z) : e);
}
function P(e) {
  if (e instanceof IDBRequest)
    return rt(e);
  if (j.has(e))
    return j.get(e);
  const t = at(e);
  return t !== e && (j.set(e, t), B.set(t, e)), t;
}
const ee = (e) => B.get(e);
function W(e, t, { blocked: s, upgrade: r, blocking: o, terminated: n } = {}) {
  const a = indexedDB.open(e, t), i = P(a);
  return r && a.addEventListener("upgradeneeded", (c) => {
    r(P(a.result), c.oldVersion, c.newVersion, P(a.transaction), c);
  }), s && a.addEventListener("blocked", (c) => s(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    c.oldVersion,
    c.newVersion,
    c
  )), i.then((c) => {
    n && c.addEventListener("close", () => n()), o && c.addEventListener("versionchange", (l) => o(l.oldVersion, l.newVersion, l));
  }).catch(() => {
  }), i;
}
function it(e, { blocked: t } = {}) {
  const s = indexedDB.deleteDatabase(e);
  return t && s.addEventListener("blocked", (r) => t(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    r.oldVersion,
    r
  )), P(s).then(() => {
  });
}
const ct = ["get", "getKey", "getAll", "getAllKeys", "count"], lt = ["put", "add", "delete", "clear"], H = /* @__PURE__ */ new Map();
function fe(e, t) {
  if (!(e instanceof IDBDatabase && !(t in e) && typeof t == "string"))
    return;
  if (H.get(t))
    return H.get(t);
  const s = t.replace(/FromIndex$/, ""), r = t !== s, o = lt.includes(s);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(s in (r ? IDBIndex : IDBObjectStore).prototype) || !(o || ct.includes(s))
  )
    return;
  const n = async function(a, ...i) {
    const c = this.transaction(a, o ? "readwrite" : "readonly");
    let l = c.store;
    return r && (l = l.index(i.shift())), (await Promise.all([
      l[s](...i),
      o && c.done
    ]))[0];
  };
  return H.set(t, n), n;
}
Te((e) => ({
  ...e,
  get: (t, s, r) => fe(t, s) || e.get(t, s, r),
  has: (t, s) => !!fe(t, s) || e.has(t, s)
}));
const dt = ["continue", "continuePrimaryKey", "advance"], pe = {}, te = /* @__PURE__ */ new WeakMap(), Ie = /* @__PURE__ */ new WeakMap(), ut = {
  get(e, t) {
    if (!dt.includes(t))
      return e[t];
    let s = pe[t];
    return s || (s = pe[t] = function(...r) {
      te.set(this, Ie.get(this)[t](...r));
    }), s;
  }
};
async function* ht(...e) {
  let t = this;
  if (t instanceof IDBCursor || (t = await t.openCursor(...e)), !t)
    return;
  t = t;
  const s = new Proxy(t, ut);
  for (Ie.set(s, t), B.set(s, ee(t)); t; )
    yield s, t = await (te.get(s) || t.continue()), te.delete(s);
}
function me(e, t) {
  return t === Symbol.asyncIterator && X(e, [IDBIndex, IDBObjectStore, IDBCursor]) || t === "iterate" && X(e, [IDBIndex, IDBObjectStore]);
}
Te((e) => ({
  ...e,
  get(t, s, r) {
    return me(t, s) ? ht : e.get(t, s, r);
  },
  has(t, s) {
    return me(t, s) || e.has(t, s);
  }
}));
function _s(e, t, s) {
  const r = (i) => new TextEncoder().encode(i).length;
  let o = 0, n = t.length - 1, a;
  for (; o <= n; ) {
    const i = Math.floor((o + n) / 2), c = t.slice(0, i + 1), l = r(e + c);
    if (l == s)
      return c;
    l < s ? (o = i + 1, a = o) : (n = i - 1, a = n);
  }
  return t.slice(0, a);
}
function Ce(e) {
  return e.match(/^drive:\/?(.+)/)?.[1] ?? null;
}
function bs(e) {
  const t = {
    title: e.properties?.title || e.appProperties?.title,
    description: e.properties?.description || e.appProperties?.description || "",
    tags: e.properties?.tags || e.appProperties?.tags,
    thumbnailUrl: e.properties?.thumbnailUrl || e.appProperties?.thumbnailUrl,
    latestSharedVersion: e.properties?.latestSharedVersion || e.appProperties?.latestSharedVersion
  };
  let s = [];
  try {
    s = t.tags ? JSON.parse(t.tags) : [], Array.isArray(s) || (s = []);
  } catch (r) {
    console.info("Exception when parsing DriveFile.tags", r);
  }
  return {
    title: t.title ?? "",
    description: t.description ?? "",
    tags: s,
    thumbnailUrl: t.thumbnailUrl,
    latestSharedVersion: t.latestSharedVersion
  };
}
function As(e, t) {
  const s = /* @__PURE__ */ new Map();
  if (e.assets)
    for (const r of Object.values(e.assets)) {
      const o = r.data[0]?.parts?.[0];
      if (o) {
        const n = we(o);
        n && s.set(n.id, {
          fileId: n,
          managed: r.metadata?.managed ?? !1,
          part: o
        });
      }
    }
  if (!t?.omitSplashImages) {
    const r = e.metadata?.visual?.presentation?.themes;
    if (r) {
      for (const { splashScreen: o } of Object.values(r))
        if (o) {
          const n = we(o);
          n && s.set(n.id, {
            fileId: n,
            managed: !0,
            part: o
          });
        }
    }
  }
  return [...s.values()];
}
function we(e) {
  if ("storedData" in e) {
    const { handle: t, resourceKey: s } = e.storedData, r = Ce(t);
    if (r)
      return { id: r, resourceKey: s };
  } else if ("fileData" in e) {
    const { fileUri: t, resourceKey: s } = e.fileData;
    if (t.match(/^[a-zA-Z0-9_-]+$/))
      return { id: t, resourceKey: s };
  }
}
function Ts(e) {
  const t = e.actual.filter(({ role: n }) => n !== "owner"), s = e.expected.filter(({ role: n }) => n !== "owner"), r = [];
  {
    const n = new Set(t.map(R));
    for (const a of s)
      n.has(R(a)) || r.push(a);
  }
  const o = [];
  {
    const n = new Set(s.map(R));
    for (const a of t)
      n.has(R(a)) || o.push(a);
  }
  return { missing: r, excess: o };
}
function R(e) {
  return JSON.stringify({
    type: e.type,
    domain: e.domain ?? void 0,
    emailAddress: e.emailAddress ?? void 0
  });
}
function Is(e, t) {
  const s = R(e);
  for (const r of t)
    if (s === R(r))
      return !0;
  return !1;
}
function Cs() {
  return ie(window.location.href).dev ?? {};
}
const Le = "flow", gt = "tab0", Ue = "mode", T = "lite", Ne = "new", De = "remix", L = "color-scheme", g = "light", p = "dark", se = "results", Me = "geo-restriction", xe = "missing-scopes", $e = "auto-sign-in", I = "resourcekey", re = "oauth_redirect", ne = "dev-";
function Ls(e, t = window.location.href) {
  const s = typeof t == "string" ? new URL(t).origin : t.origin, r = new URL(s), { page: o } = e;
  if (e?.oauthRedirect && r.searchParams.set(re, e.oauthRedirect), o === "home")
    r.pathname = "/", e.lite && r.searchParams.set(T, e.lite === !0 ? "true" : "false"), (e.colorScheme === g || e.colorScheme === p) && r.searchParams.set(
      L,
      e.colorScheme === g ? g : p
    ), e.new && r.searchParams.set(Ne, e.new === !0 ? "true" : "false");
  else if (o === "graph") {
    const n = Ce(e.flow);
    if (!n)
      throw new Error("unsupported graph id " + e.flow);
    if (e.mode === "app")
      r.pathname = "app/" + encodeURIComponent(n);
    else if (e.mode === "canvas")
      r.pathname = "edit/" + encodeURIComponent(n);
    else
      throw e.mode, new Error("unsupported mode " + e.mode);
    e.resourceKey && r.searchParams.set(I, e.resourceKey), e.remix && r.searchParams.set(De, e.remix ? "true" : "false"), e.results && r.searchParams.set(se, e.results), e.lite && r.searchParams.set(T, e.lite === !0 ? "true" : "false"), (e.colorScheme === g || e.colorScheme === p) && r.searchParams.set(
      L,
      e.colorScheme === g ? g : p
    );
  } else if (o === "landing")
    r.pathname = "landing/", e.geoRestriction && r.searchParams.set(Me, "true"), e.missingScopes && r.searchParams.set(xe, "true"), e.autoSignIn && r.searchParams.set($e, "true"), e.lite && r.searchParams.set(T, e.lite === !0 ? "true" : "false"), (e.colorScheme === g || e.colorScheme === p) && r.searchParams.set(
      L,
      e.colorScheme === g ? g : p
    ), e.redirect.page === "graph" && (r.searchParams.set(Le, e.redirect.flow), e.redirect.resourceKey && r.searchParams.set(I, e.redirect.resourceKey), e.redirect.results && r.searchParams.set(se, e.redirect.results), r.searchParams.set(Ue, e.redirect.mode), e.redirect.lite && r.searchParams.set(T, e.redirect.lite === !0 ? "true" : "false"), (e.redirect.colorScheme === g || e.redirect.colorScheme === p) && r.searchParams.set(
      L,
      e.redirect.colorScheme === g ? g : p
    ), e.redirect.oauthRedirect && r.searchParams.set(re, e.redirect.oauthRedirect));
  else if (o === "open")
    r.pathname = `open/${encodeURIComponent(e.fileId)}`, e.resourceKey && r.searchParams.set(I, e.resourceKey);
  else
    throw new Error(
      `unhandled page ${JSON.stringify(o)} from ${JSON.stringify(e)}`
    );
  if (e.dev)
    for (const [n, a] of Object.entries(
      e.dev
    ))
      r.searchParams.set(ne + n, a);
  return e.guestPrefixed && (r.pathname = "/_app" + r.pathname), r.href.replace("drive%3A%2F", "drive:/");
}
function ie(e) {
  typeof e == "string" && (e = new URL(e));
  let t;
  const s = e.searchParams.get(re);
  for (const [n, a] of e.searchParams)
    if (n.startsWith(ne)) {
      t ??= {};
      const i = n.slice(ne.length);
      t[i] = a;
    }
  const r = e.pathname.startsWith("/_app/"), o = r ? e.pathname.slice(5) : e.pathname;
  if (o === "/landing/" || o === "/landing") {
    const n = new URL(e);
    n.pathname = "/";
    const a = ie(n), i = {
      page: "landing",
      redirect: a.page === "landing" || a.page === "open" ? {
        page: "home",
        redirectFromLanding: !0,
        guestPrefixed: !0
      } : {
        ...a,
        redirectFromLanding: !0,
        guestPrefixed: !0
      },
      guestPrefixed: r
    };
    return e.searchParams.has(Me) && (i.geoRestriction = !0), e.searchParams.has(xe) && (i.missingScopes = !0), e.searchParams.has($e) && (i.autoSignIn = !0), s && (i.oauthRedirect = s), t && (i.dev = t), i;
  } else {
    if (o.startsWith("/open/"))
      return {
        page: "open",
        fileId: o.slice(6),
        resourceKey: e.searchParams.get(I) ?? void 0,
        guestPrefixed: r
      };
    {
      let n = e.searchParams.get(Le) || e.searchParams.get(gt) || o.startsWith("/app/") && o.slice(5) || o.startsWith("/edit/") && o.slice(6);
      if (n && !n.startsWith("drive:/") && (o.startsWith("/app/") || o.startsWith("/edit/")) && (n = "drive:/" + n), !n) {
        const d = {
          page: "home",
          lite: e.searchParams.get("lite") === "true",
          colorScheme: e.searchParams.get("color-scheme") === g ? g : e.searchParams.get("color-scheme") === p ? p : void 0,
          new: e.searchParams.get(Ne) === "true",
          guestPrefixed: r
        };
        return t && (d.dev = t), s && (d.oauthRedirect = s), d;
      }
      const i = {
        page: "graph",
        mode: e.searchParams.get(Ue) === "app" || o.startsWith("/app/") ? "app" : "canvas",
        lite: e.searchParams.get(T) === "true",
        colorScheme: e.searchParams.get("color-scheme") === g ? g : e.searchParams.get("color-scheme") === p ? p : void 0,
        flow: n,
        resourceKey: e.searchParams.get(I) ?? void 0,
        guestPrefixed: r
      }, c = e.searchParams.get(De);
      c && (i.remix = c === "true");
      const l = e.searchParams.get(se);
      return l && (i.results = l), t && (i.dev = t), s && (i.oauthRedirect = s), i;
    }
  }
}
const Us = "shellOrigin", Ns = "opal_shell_establish_message_channel_request", Ds = "opal_shell_establish_message_channel_response";
const Fe = /* @__PURE__ */ Symbol("Comlink.proxy"), ft = /* @__PURE__ */ Symbol("Comlink.endpoint"), pt = /* @__PURE__ */ Symbol("Comlink.releaseProxy"), V = /* @__PURE__ */ Symbol("Comlink.finalizer"), M = /* @__PURE__ */ Symbol("Comlink.thrown"), Ge = (e) => typeof e == "object" && e !== null || typeof e == "function", mt = {
  canHandle: (e) => Ge(e) && e[Fe],
  serialize(e) {
    const { port1: t, port2: s } = new MessageChannel();
    return Be(e, t), [s, [s]];
  },
  deserialize(e) {
    return e.start(), St(e);
  }
}, wt = {
  canHandle: (e) => Ge(e) && M in e,
  serialize({ value: e }) {
    let t;
    return e instanceof Error ? t = {
      isError: !0,
      value: {
        message: e.message,
        name: e.name,
        stack: e.stack
      }
    } : t = { isError: !1, value: e }, [t, []];
  },
  deserialize(e) {
    throw e.isError ? Object.assign(new Error(e.value.message), e.value) : e.value;
  }
}, C = /* @__PURE__ */ new Map([
  ["proxy", mt],
  ["throw", wt]
]);
function yt(e, t) {
  for (const s of e)
    if (t === s || s === "*" || s instanceof RegExp && s.test(t))
      return !0;
  return !1;
}
function Be(e, t = globalThis, s = ["*"]) {
  t.addEventListener("message", function r(o) {
    if (!o || !o.data)
      return;
    if (!yt(s, o.origin)) {
      console.warn(`Invalid origin '${o.origin}' for comlink proxy`);
      return;
    }
    const { id: n, type: a, path: i } = Object.assign({ path: [] }, o.data), c = (o.data.argumentList || []).map(v);
    let l;
    try {
      const d = i.slice(0, -1).reduce((u, E) => u[E], e), f = i.reduce((u, E) => u[E], e);
      switch (a) {
        case "GET":
          l = f;
          break;
        case "SET":
          d[i.slice(-1)[0]] = v(o.data.value), l = !0;
          break;
        case "APPLY":
          l = f.apply(d, c);
          break;
        case "CONSTRUCT":
          {
            const u = new f(...c);
            l = Ve(u);
          }
          break;
        case "ENDPOINT":
          {
            const { port1: u, port2: E } = new MessageChannel();
            Be(e, E), l = Rt(u, [u]);
          }
          break;
        case "RELEASE":
          l = void 0;
          break;
        default:
          return;
      }
    } catch (d) {
      l = { value: d, [M]: 0 };
    }
    Promise.resolve(l).catch((d) => ({ value: d, [M]: 0 })).then((d) => {
      const [f, u] = G(d);
      t.postMessage(Object.assign(Object.assign({}, f), { id: n }), u), a === "RELEASE" && (t.removeEventListener("message", r), je(t), V in e && typeof e[V] == "function" && e[V]());
    }).catch((d) => {
      const [f, u] = G({
        value: new TypeError("Unserializable return value"),
        [M]: 0
      });
      t.postMessage(Object.assign(Object.assign({}, f), { id: n }), u);
    });
  }), t.start && t.start();
}
function Et(e) {
  return e.constructor.name === "MessagePort";
}
function je(e) {
  Et(e) && e.close();
}
function St(e, t) {
  const s = /* @__PURE__ */ new Map();
  return e.addEventListener("message", function(o) {
    const { data: n } = o;
    if (!n || !n.id)
      return;
    const a = s.get(n.id);
    if (a)
      try {
        a(n);
      } finally {
        s.delete(n.id);
      }
  }), oe(e, s, [], t);
}
function U(e) {
  if (e)
    throw new Error("Proxy has been released and is not useable");
}
function We(e) {
  return O(e, /* @__PURE__ */ new Map(), {
    type: "RELEASE"
  }).then(() => {
    je(e);
  });
}
const $ = /* @__PURE__ */ new WeakMap(), F = "FinalizationRegistry" in globalThis && new FinalizationRegistry((e) => {
  const t = ($.get(e) || 0) - 1;
  $.set(e, t), t === 0 && We(e);
});
function Pt(e, t) {
  const s = ($.get(t) || 0) + 1;
  $.set(t, s), F && F.register(e, t, e);
}
function vt(e) {
  F && F.unregister(e);
}
function oe(e, t, s = [], r = function() {
}) {
  let o = !1;
  const n = new Proxy(r, {
    get(a, i) {
      if (U(o), i === pt)
        return () => {
          vt(n), We(e), t.clear(), o = !0;
        };
      if (i === "then") {
        if (s.length === 0)
          return { then: () => n };
        const c = O(e, t, {
          type: "GET",
          path: s.map((l) => l.toString())
        }).then(v);
        return c.then.bind(c);
      }
      return oe(e, t, [...s, i]);
    },
    set(a, i, c) {
      U(o);
      const [l, d] = G(c);
      return O(e, t, {
        type: "SET",
        path: [...s, i].map((f) => f.toString()),
        value: l
      }, d).then(v);
    },
    apply(a, i, c) {
      U(o);
      const l = s[s.length - 1];
      if (l === ft)
        return O(e, t, {
          type: "ENDPOINT"
        }).then(v);
      if (l === "bind")
        return oe(e, t, s.slice(0, -1));
      const [d, f] = ye(c);
      return O(e, t, {
        type: "APPLY",
        path: s.map((u) => u.toString()),
        argumentList: d
      }, f).then(v);
    },
    construct(a, i) {
      U(o);
      const [c, l] = ye(i);
      return O(e, t, {
        type: "CONSTRUCT",
        path: s.map((d) => d.toString()),
        argumentList: c
      }, l).then(v);
    }
  });
  return Pt(n, e), n;
}
function Ot(e) {
  return Array.prototype.concat.apply([], e);
}
function ye(e) {
  const t = e.map(G);
  return [t.map((s) => s[0]), Ot(t.map((s) => s[1]))];
}
const He = /* @__PURE__ */ new WeakMap();
function Rt(e, t) {
  return He.set(e, t), e;
}
function Ve(e) {
  return Object.assign(e, { [Fe]: !0 });
}
function G(e) {
  for (const [t, s] of C)
    if (s.canHandle(e)) {
      const [r, o] = s.serialize(e);
      return [
        {
          type: "HANDLER",
          name: t,
          value: r
        },
        o
      ];
    }
  return [
    {
      type: "RAW",
      value: e
    },
    He.get(e) || []
  ];
}
function v(e) {
  switch (e.type) {
    case "HANDLER":
      return C.get(e.name).deserialize(e.value);
    case "RAW":
      return e.value;
  }
}
function O(e, t, s, r) {
  return new Promise((o) => {
    const n = kt();
    t.set(n, o), e.start && e.start(), e.postMessage(Object.assign({ id: n }, s), r);
  });
}
function kt() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}
const _t = /* @__PURE__ */ new Set([204, 205, 304]);
console.debug(
  `[shell ${window === window.parent ? "host" : "guest"}] Installing comlink transfer handlers`
);
C.set("URL", {
  canHandle: (e) => e instanceof URL,
  serialize: (e) => [e.href, []],
  deserialize: (e) => new URL(e)
});
const bt = (() => {
  const e = new ReadableStream(), { port1: t } = new MessageChannel();
  try {
    return t.postMessage(e, [e]), !0;
  } catch {
    return !1;
  }
})();
C.set("Response", {
  canHandle: (e) => e instanceof Response,
  serialize: (e) => {
    const { headers: t, status: s, statusText: r } = e;
    let o;
    if (e.body === null || _t.has(s))
      o = null;
    else if (bt)
      o = e.body;
    else {
      const n = new MessageChannel();
      At(e.body.getReader(), n.port1), o = n.port2;
    }
    return [
      {
        body: o,
        init: {
          // Headers instances are not cloneable, but their entries arrays are,
          // and conveniently those arrays are also valid as headers, so we can
          // just convert.
          headers: [...t],
          status: s,
          statusText: r
        }
      },
      o ? [o] : []
    ];
  },
  deserialize: ({ body: e, init: t }) => new Response(
    e instanceof MessagePort ? Tt(e) : e,
    t
  )
});
async function At(e, t) {
  for (; ; ) {
    const { done: s, value: r } = await e.read();
    if (s)
      break;
    t.postMessage(
      {
        done: !1,
        value: r.buffer
      },
      [r.buffer]
    );
  }
  e.releaseLock(), t.postMessage({ done: !0 }), t.close();
}
function Tt(e) {
  const t = new TransformStream(), s = t.writable.getWriter(), r = new AbortController();
  return e.addEventListener(
    "message",
    (o) => {
      const n = o.data;
      n.done ? (s.close(), r.abort()) : s.write(new Uint8Array(n.value));
    },
    { signal: r.signal }
  ), e.start(), t.readable;
}
const It = new FinalizationRegistry(
  (e) => e.close()
);
C.set("RequestInit", {
  canHandle: (e) => (
    // RequestInits are plain objects, so this is a good-enough detection
    // heuristic.
    typeof e == "object" && e !== null && ("headers" in e || "body" in e || "signal" in e) && // Response objects also match the above heuristic, and we handle those
    // separately (technically we don't need this as long as this handler is
    // installed after the Response handler, so this check is just defensive).
    !(e instanceof Response)
  ),
  serialize: (e) => {
    e = { ...e };
    const t = { init: e }, s = [];
    if (e.headers instanceof Headers && (e.headers = [...e.headers]), e.body instanceof FormData && (t.formData = [...e.body], delete e.body), e.signal) {
      const r = e.signal, o = new MessageChannel(), { port1: n, port2: a } = o;
      It.register(e.signal, n), delete e.signal, t.signal = a, s.push(a), n.start(), r.aborted ? (n.postMessage(r.reason), n.close()) : r.addEventListener(
        "abort",
        () => {
          n.postMessage(r.reason), n.close();
        },
        { once: !0 }
      );
    }
    return [t, s];
  },
  deserialize: (e) => {
    const t = { ...e.init };
    if (e.formData) {
      t.body = new FormData();
      for (const [s, r] of e.formData)
        t.body.set(s, r);
    }
    if (e.signal) {
      const s = new AbortController();
      t.signal = s.signal;
      const r = e.signal;
      r.addEventListener(
        "message",
        ({ data: o }) => {
          s.abort(o), r.close();
        },
        { once: !0 }
      ), r.start();
    }
    return t;
  }
});
const ze = {
  // https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest
  openid: {
    category: "Google Account",
    // Always required according to the OpenID Connect Core spec.
    required: !0
  },
  // https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
  profile: {
    aliases: ["https://www.googleapis.com/auth/userinfo.profile"],
    category: "Google Account"
  },
  // https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
  email: {
    aliases: ["https://www.googleapis.com/auth/userinfo.email"],
    category: "Google Account",
    // Required for checking geo-location.
    required: !0
  },
  // https://developers.google.com/workspace/drive/api/guides/api-specific-auth#drive-scopes
  "https://www.googleapis.com/auth/drive.readonly": {
    category: "Google Drive",
    // TODO(aomarks) Make this incremental.
    required: !0
  },
  // https://developers.google.com/workspace/drive/api/guides/api-specific-auth#drive-scopes
  "https://www.googleapis.com/auth/drive.file": {
    category: "Google Drive",
    // TODO(aomarks) Make this incremental.
    required: !0
  },
  // https://ai.google.dev/gemini-api/docs/oauth
  "https://www.googleapis.com/auth/generative-language.retriever": {
    category: "Gemini",
    required: !0
  },
  // https://developers.google.com/workspace/calendar/api/auth
  "https://www.googleapis.com/auth/calendar.readonly": {
    category: "Google Calendar"
  },
  // https://developers.google.com/workspace/calendar/api/auth
  "https://www.googleapis.com/auth/calendar.events.owned": {
    category: "Google Calendar"
  },
  // https://developers.google.com/workspace/gmail/api/auth/scopes
  "https://www.googleapis.com/auth/gmail.modify": {
    category: "Gmail"
  }
}, z = Object.entries(ze).filter(([, e]) => "required" in e && e.required).map(([e]) => e), qe = /* @__PURE__ */ new Map();
for (const [e, t] of Object.entries(ze))
  if ("aliases" in t)
    for (const s of t.aliases)
      qe.set(s, e);
function k(e) {
  return qe.get(e) ?? e;
}
const Ct = (
  /* 1 minute */
  6e4
);
class Lt {
  #e;
  #t;
  constructor(t, s) {
    this.#e = t, this.#t = s;
  }
  getToken() {
    const t = this.#e.get();
    if (t === void 0)
      return { state: "signedout" };
    const s = JSON.parse(t);
    if (!!s.refresh_token)
      return { state: "signedout" };
    const o = s.client_id === void 0;
    return Ut(s) || o ? {
      state: "expired",
      grant: s,
      refresh: (n) => this.#r(s, n?.signal)
    } : { state: "valid", grant: s };
  }
  async #r(t, s) {
    t.client_id === void 0 && (t = await this.#n(t));
    const r = new URL("/connection/refresh/", window.location.origin), o = Date.now(), n = await fetch(r, {
      signal: s,
      credentials: "include"
    });
    if (!n.ok) {
      if (n.status === 401 && (await n.json()).error?.includes("missing cookie: "))
        return this.#e.set(void 0), { state: "signedout" };
      throw new Error(
        `Failed to refresh token, status: ${n.status} ${n.statusText}`
      );
    }
    const a = await n.json();
    if (a.error !== void 0)
      throw new Error(`Failed to refresh token, error: ${a.error}`);
    const i = {
      client_id: t.client_id,
      access_token: a.access_token,
      expires_in: a.expires_in,
      issue_time: o,
      id: t.id,
      picture: t.picture,
      name: t.name,
      domain: t.domain,
      scopes: t.scopes,
      authuser: t.authuser
    };
    return await this.#e.set(JSON.stringify(i)), { state: "valid", grant: i };
  }
  async #n(t) {
    return {
      ...t,
      client_id: this.#t.OAUTH_CLIENT
    };
  }
}
function Ut(e) {
  return /* absolute milliseconds */ e.issue_time + /* relative seconds */
  e.expires_in * 1e3 - /* unix milliseconds */
  Date.now() <= Ct;
}
class Nt {
  #e;
  constructor(t) {
    this.#e = t;
  }
  get(t, s) {
    return this.#e.values[t]?.items.get(s);
  }
  async set(t, s, r) {
    const o = this.#e.values;
    o[t] && (o[t].items.set(s, r), await this.#e.save(o));
  }
  async delete(t, s) {
    const r = this.#e.values;
    r[t] && (r[t].items.delete(s), await this.#e.save(r));
  }
}
var Dt = /* @__PURE__ */ ((e) => (e.UNSAVED = "unsaved", e.SAVING = "saving", e.SAVED = "saved", e.ERROR = "error", e))(Dt || {}), y = /* @__PURE__ */ ((e) => (e.CONNECTIONS = "Connections", e))(y || {});
const _ = "settings", q = 7;
class ce {
  static #e;
  static restoredInstance() {
    return this.#e ??= (async () => {
      const t = new ce();
      return await t.restore(), t;
    })();
  }
  #t = {
    [y.CONNECTIONS]: {
      configuration: {
        extensible: !1,
        description: "Third-party services boards can access. When you are signed into a service, any board can access and modify your data on that service.",
        nameEditable: !1,
        nameVisible: !1
      },
      items: /* @__PURE__ */ new Map([])
    }
  };
  get values() {
    return structuredClone(this.#t);
  }
  getItem(t, s) {
    return this.#t[t]?.items.get(s);
  }
  constructor() {
  }
  async saveItem(t, s) {
    const r = await W(_, q), o = r.transaction(t, "readwrite");
    o.store.put(s), await o.done, r.close();
  }
  async save(t) {
    const s = await W(_, q), r = Object.keys(t).filter((n) => {
      const a = s.objectStoreNames.contains(n);
      return a || console.error(
        `[token-store] Expected IDB object store ${JSON.stringify(n)} to exist, but it did not. Settings for this store will be lost. A schema upgrade is probably required.`
      ), a;
    }), o = s.transaction(r, "readwrite");
    await Promise.all(
      r.map(async (n) => {
        const a = o.objectStore(n);
        await a.clear();
        const i = t[n];
        await Promise.all(
          [...i.items.values()].map((c) => a.put(c))
        );
      })
    ), o.commit(), await o.done, s.close(), this.#t = t;
  }
  async restore() {
    const t = this.#t, s = await W(_, q, {
      upgrade(o, n, a) {
        console.log("[token-store] Upgrading IndexedDB", {
          oldVersion: n,
          newVersion: a,
          objectStoreNames: [...o.objectStoreNames]
        });
        for (const i of Object.keys(t)) {
          const c = i;
          o.objectStoreNames.contains(c) || o.createObjectStore(c, {
            keyPath: "id",
            autoIncrement: !0
          });
        }
      }
    }), r = y.CONNECTIONS;
    if (s.objectStoreNames.contains(r)) {
      const o = await s.getAll(r);
      for (const n of o)
        this.#t[r].items.set(n.name, n);
    }
    s.close();
  }
  async delete() {
    console.log(`[token-store] Deleting ${_} IndexedDB`), await it(_), await this.restore();
  }
}
const Ee = window.trustedTypes?.createPolicy("opal-gapi-url", {
  createScriptURL: Je
}), Mt = Ee?.createScriptURL.bind(Ee) ?? Je;
function Je() {
  return "https://apis.google.com/js/api.js";
}
let xt;
async function Ke() {
  return xt ??= (async () => (await jt(Mt("")), globalThis.gapi))();
}
let $t;
async function Ft() {
  return $t ??= (async () => {
    const e = await Ke();
    return await new Promise((t) => e.load("picker", t)), globalThis.google.picker;
  })();
}
let Gt;
async function Bt() {
  return Gt ??= (async () => {
    const e = await Ke();
    return await new Promise((t) => e.load("drive-share", t)), e.drive.share.ShareClient;
  })();
}
async function jt(e) {
  const t = document.createElement("script");
  t.async = !0, t.src = e;
  let s, r;
  const o = new Promise((a, i) => {
    s = a, r = i;
  }), n = new AbortController();
  return t.addEventListener(
    "load",
    () => {
      s(), n.abort();
    },
    { once: !0, signal: n.signal }
  ), t.addEventListener(
    "error",
    () => {
      r(), n.abort();
    },
    { once: !0, signal: n.signal }
  ), document.head.appendChild(t), o;
}
const Se = "oauth_redirect";
function Wt() {
  const e = Ht();
  return e ? e.origin : window.location.origin;
}
function Ht() {
  const e = new URLSearchParams(window.location.search);
  if (!e.has(Se))
    return null;
  const t = new URL(e.get(Se));
  return (h.ALLOWED_REDIRECT_ORIGINS ?? []).includes(t.origin) ? t : null;
}
const Ye = "https://www.googleapis.com/drive/v3/files", Vt = "https://www.googleapis.com/upload/drive/v3/files", zt = "https://www.googleapis.com/calendar/v3/calendars", qt = "https://gmail.googleapis.com", Jt = "https://generativelanguage.googleapis.com/v1beta/models", Kt = "https://docs.googleapis.com/v1/documents", Yt = "https://slides.googleapis.com/v1/presentations", Xt = "https://sheets.googleapis.com/v4/spreadsheets", Qt = "https://labsnotebooklm.pa.googleapis.com", Zt = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events.owned"
], b = [
  "https://www.googleapis.com/auth/drive.readonly"
], es = [
  "https://www.googleapis.com/auth/gmail.modify"
], J = [
  "https://www.googleapis.com/auth/generative-language.retriever"
];
function A(e) {
  return e ? new URL(e) : void 0;
}
const ts = [
  ...h.BACKEND_API_ENDPOINT ? [
    {
      canonicalPrefix: new URL(
        h.BACKEND_API_ENDPOINT
      ),
      scopes: J,
      shouldAddAccessTokenToJsonBody: (e) => e.endsWith("/uploadGeminiFile") || e.endsWith("/uploadBlobFile") || e.includes("/generateWebpageStream") || e.includes("/streamRunAgent") || e.includes("/sessions/new") || e.includes("/sessions/") && e.includes(":resume") || e.includes("/graphSessions/new") || e.includes("/graphSessions/") && e.includes(":resume")
    }
  ] : [],
  {
    canonicalPrefix: new URL(Ye),
    scopes: b,
    remapOrigin: A(
      h.GOOGLE_DRIVE_API_ENDPOINT
    ),
    allowQueryParams: (e) => !e.has("q")
  },
  {
    canonicalPrefix: new URL(Vt),
    scopes: b,
    remapOrigin: A(
      h.GOOGLE_DRIVE_API_ENDPOINT
    )
  },
  {
    canonicalPrefix: new URL(Kt),
    scopes: b,
    remapOrigin: A(
      h.GOOGLE_DOCS_API_ENDPOINT
    )
  },
  {
    canonicalPrefix: new URL(Yt),
    scopes: b,
    remapOrigin: A(
      h.GOOGLE_SLIDES_API_ENDPOINT
    )
  },
  {
    canonicalPrefix: new URL(Xt),
    scopes: b,
    remapOrigin: A(
      h.GOOGLE_SHEETS_API_ENDPOINT
    )
  },
  {
    canonicalPrefix: new URL(Jt),
    scopes: J,
    // Not currently configurable
    remapOrigin: void 0
  },
  {
    canonicalPrefix: new URL(zt),
    scopes: Zt,
    // Not currently configurable
    remapOrigin: void 0
  },
  {
    canonicalPrefix: new URL(qt),
    scopes: es,
    // Not currently configurable
    remapOrigin: void 0
  },
  {
    canonicalPrefix: new URL(Qt),
    scopes: J,
    // Not currently configurable
    remapOrigin: void 0
  }
];
function Pe(e) {
  const t = new URL(e);
  for (const s of ts) {
    const {
      canonicalPrefix: r,
      scopes: o,
      remapOrigin: n,
      shouldAddAccessTokenToJsonBody: a,
      allowQueryParams: i
    } = s;
    if (t.origin === r.origin && t.pathname.startsWith(r.pathname)) {
      if (i && !i(t.searchParams))
        return;
      let c;
      return n && n.origin !== t.origin && (c = new URL(
        n.origin + t.pathname + t.search + t.hash
      )), {
        scopes: o,
        remappedUrl: c,
        shouldAddAccessTokenToJsonBody: !!a?.(e)
      };
    }
  }
}
var ve;
(function(e) {
  e.Ordinary = "ordinary", e.Constant = "constant", e.Control = "control", e.Star = "star";
})(ve || (ve = {}));
var Oe;
(function(e) {
  e.Indeterminate = "indeterminate", e.Connected = "connected", e.Ready = "ready", e.Missing = "missing", e.Dangling = "dangling";
})(Oe || (Oe = {}));
var Re;
(function(e) {
  e.GET_ANY_WEBPAGE = "GET_ANY_WEBPAGE", e.OPEN_WEBPAGE = "OPEN_WEBPAGE", e.ACCESS_ASSET = "ACCESS_ASSET";
})(Re || (Re = {}));
var ke;
(function(e) {
  e.ALLOW = "allow", e.DENY = "deny", e.ALWAYS_ALLOW = "alwaysAllow", e.ALWAYS_DENY = "alwaysDeny";
})(ke || (ke = {}));
var _e;
(function(e) {
  e.MODAL = "MODAL", e.IN_APP = "IN_APP";
})(_e || (_e = {}));
const ss = 200, K = 3;
async function rs(e, t, s) {
  let r = K;
  for (; ; ) {
    let o, n = !1;
    try {
      o = await e(t, s), o.status >= 500 && o.status <= 599 && (n = !0, console.warn(`Error in fetch(${t}). Attempts left: ${r - 1}/${K}. Response:`, o));
    } catch (a) {
      n = !0, console.warn(`Exception in fetch(${t}). Attempts left: ${r - 1}/${K}`, a), o = new Response(null, { status: 403 });
    }
    if (r--, !n || r <= 0)
      return o;
    await new Promise((a) => setTimeout(a, ss));
  }
}
class le {
  #e;
  #t;
  #r;
  #n;
  constructor(t) {
    const s = Promise.resolve(t.apiBaseUrl).then((r) => r ?? "https://www.googleapis.com");
    this.#e = s.then((r) => `${r}/drive/v3/files`), this.#t = s.then((r) => `${r}/upload/drive/v3/files`), this.#r = t.proxyBaseUrl ? {
      apiUrl: `${t.proxyBaseUrl}/drive/v3/files`,
      marked: /* @__PURE__ */ new Set()
    } : void 0, this.fetchWithCreds = t.fetchWithCreds, this.#n = t.log ?? (() => {
    });
  }
  async #s(t, s, r, o) {
    const n = this.#l(r);
    if (s?.headers)
      for (const [i, c] of Object.entries(s.headers))
        n.set(i, c);
    const a = o === "anonymous" ? globalThis.fetch : this.fetchWithCreds;
    return rs(a, t, { ...s, headers: n });
  }
  #l(t) {
    const s = new Headers();
    if (t) {
      const r = as(t);
      r && s.set(os, r);
    }
    return s;
  }
  markFileForReadingWithPublicProxy(...t) {
    if (this.#r)
      for (const s of t)
        this.#r.marked.add(s);
  }
  fileIsMarkedForReadingWithPublicProxy(t) {
    return !!this.#r?.marked.has(t);
  }
  async #a(t, s = !1) {
    const r = this.#r && this.#r.marked.has(t), o = this.#r?.apiUrl && await this.#e === this.#r.apiUrl;
    return {
      apiUrl: !s && r ? this.#r.apiUrl : await this.#e,
      authorization: !s && r || o ? "anonymous" : "fetchWithCreds"
    };
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/files/get#:~:text=metadata */
  async getFileMetadata(t, s) {
    t = N(t);
    const { apiUrl: r, authorization: o } = await this.#a(t.id, s?.bypassProxy), n = new URL(
      `${r}/${encodeURIComponent(t.id)}`
      // TODO(aomarks) We don't actually implement any caching for metadata yet.
      // We could, and the only slightly tricky part about it is applying the
      // field mask, because we'd likely want to always fetch "*" in the proxy,
      // regardless of which fields the triggering request had, so that we get
      // more cache hits. But, might as well route it in now.
    );
    (s?.supportsAllDrives ?? !0) && n.searchParams.set("supportsAllDrives", "true"), s?.fields && n.searchParams.set("fields", s.fields.join(","));
    const a = await this.#s(n, { signal: s?.signal }, [t], o);
    if (a.ok)
      return a.json();
    throw new Error(`Google Drive getFileMetadata ${a.status} error ` + await a.text());
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/files/get#:~:text=media */
  async getFileMedia(t, s) {
    t = N(t);
    const { apiUrl: r, authorization: o } = await this.#a(t.id), n = new URL(`${r}/${encodeURIComponent(t.id)}`);
    return n.searchParams.set("alt", "media"), await this.#s(n, { signal: s?.signal }, [t], o);
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/files/export */
  async exportFile(t, s) {
    t = N(t);
    const { apiUrl: r, authorization: o } = await this.#a(t.id), n = new URL(
      `${r}/${encodeURIComponent(t.id)}/export`
      // TODO(aomarks) Use getBaseUrlForPossiblyProxiedFileRead, but need to
      // implement the server side first.
    );
    return n.searchParams.set("mimeType", s.mimeType), this.#s(n, { signal: s?.signal }, [t], o);
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/files/create#:~:text=metadata%2Donly */
  async createFileMetadata(t, s) {
    const r = new URL(await this.#e);
    s?.fields && r.searchParams.set("fields", s.fields.join(","));
    const o = await this.#s(r, {
      method: "POST",
      body: JSON.stringify(t),
      signal: s?.signal
    });
    if (!o.ok)
      throw new Error(`Google Drive createFileMetadata ${o.status} error: ` + await o.text());
    return await o.json();
  }
  async createFile(t, s, r) {
    const o = await this.#c(void 0, t, s, r), n = o.id;
    return this.#n("verbose", "Created file", {
      id: n,
      open: n ? `http://drive.google.com/open?id=${n}` : null,
      name: s?.name,
      mimeType: s?.mimeType || (typeof t != "string" ? t.type : void 0)
    }), o;
  }
  async updateFile(t, s, r, o) {
    const n = this.#c(t, s, r, o);
    return this.#n("verbose", "Updated file", {
      id: t,
      open: `http://drive.google.com/open?id=${t}`,
      name: r?.name,
      mimeType: r?.mimeType || (typeof s != "string" ? s.type : void 0)
    }), n;
  }
  async #c(t, s, r, o) {
    const n = !!t;
    typeof s != "string" && r?.mimeType && s.type !== r.mimeType && this.#n("warning", `Blob had type ${JSON.stringify(s.type)} while metadata had type ${JSON.stringify(r.mimeType)}.`);
    const i = await this.#t, c = new URL(n ? `${i}/${encodeURIComponent(t)}` : i);
    c.searchParams.set("uploadType", "multipart"), o?.fields && c.searchParams.set("fields", o.fields.join(","));
    const l = new FormData();
    l.append("metadata", new Blob([JSON.stringify(r ?? {})], {
      type: "application/json; charset=UTF-8"
    })), l.append("file", s);
    const d = await this.#s(c, {
      method: n ? "PATCH" : "POST",
      body: l,
      signal: o?.signal
    }, void 0, "fetchWithCreds");
    if (!d.ok)
      throw new Error(`Google Drive uploadFileMultipart ${d.status} error: ` + await d.text());
    return d.json();
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/files/update */
  async updateFileMetadata(t, s, r) {
    const o = new URL(`${await this.#e}/${encodeURIComponent(t)}`);
    r?.addParents && o.searchParams.set("addParents", r.addParents.join(",")), r?.removeParents && o.searchParams.set("removeParents", r.removeParents.join(",")), r?.fields && o.searchParams.set("fields", r.fields.join(","));
    const n = await this.#s(o, {
      method: "PATCH",
      body: JSON.stringify(s),
      signal: r?.signal
    });
    if (!n.ok)
      throw new Error(`Google Drive updateFileMetadata ${n.status} error: ` + await n.text());
    return await n.json();
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/files/delete */
  async deleteFile(t, s) {
    const r = await this.#s(new URL(`${await this.#e}/${encodeURIComponent(t)}`), { method: "DELETE", signal: s?.signal });
    if (!r.ok)
      throw new Error(`Google Drive deleteFile ${r.status} error: ` + await r.text());
  }
  async isReadable(t, s) {
    try {
      return await this.getFileMetadata(t, {
        fields: [],
        signal: s?.signal
      }), !0;
    } catch {
      return !1;
    }
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/files/list */
  async listFiles(t, s) {
    const r = new URL(await this.#e);
    r.searchParams.set("q", t), s?.pageSize && r.searchParams.set("pageSize", String(s.pageSize)), s?.fields && r.searchParams.set("fields", `nextPageToken,files(${s.fields.join(",")})`), s?.orderBy?.length && r.searchParams.set("orderBy", s.orderBy.map(({ field: a, dir: i }) => `${a} ${i}`).join(","));
    const o = [];
    let n;
    do {
      n && r.searchParams.set("pageToken", n);
      const a = await this.#s(r, { signal: s?.signal });
      if (!a.ok)
        throw new Error(`Google Drive listFiles ${a.status} error: ` + await a.text());
      const i = await a.json();
      o.push(...i.files), n = i.nextPageToken;
    } while (n);
    return { files: o };
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/permissions/create */
  async createPermission(t, s, r) {
    const o = new URL(`${await this.#e}/${encodeURIComponent(t)}/permissions`);
    o.searchParams.set("sendNotificationEmail", r.sendNotificationEmail ? "true" : "false");
    const n = await this.#s(o, {
      method: "POST",
      body: JSON.stringify(ns(s)),
      signal: r?.signal
    });
    if (!n.ok)
      throw new Error(`Google Drive createPermission ${n.status} error: ` + await n.text());
    const a = await n.json();
    return this.#n("verbose", `Created permission ${a.id} on file ${t}`), a;
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/permissions/delete */
  async deletePermission(t, s, r) {
    const o = await this.#s(new URL(`${await this.#e}/${encodeURIComponent(t)}/permissions/${encodeURIComponent(s)}`), {
      method: "DELETE",
      signal: r?.signal
    });
    if (!o.ok)
      throw new Error(`Google Drive deletePermission ${o.status} error: ` + await o.text());
    this.#n("verbose", `Deleted permission ${s} from file ${t}`);
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/files/copy */
  async copyFile(t, s, r) {
    t = N(t);
    const o = new URL(`${await this.#e}/${encodeURIComponent(t.id)}/copy`);
    r?.fields && o.searchParams.set("fields", r.fields.join(","));
    const n = await this.#s(o, {
      method: "POST",
      signal: r?.signal,
      body: JSON.stringify(s ?? {})
    });
    return n.ok ? { ok: !0, value: await n.json() } : { ok: !1, error: { status: n.status } };
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/files/generateIds */
  async generateIds(t, s) {
    const r = new URL(`${await this.#e}/generateIds`);
    r.searchParams.set("count", String(t));
    const o = await this.#s(r, { signal: s?.signal });
    if (!o.ok)
      throw new Error(`Google Drive generateIds ${o.status} error: ` + await o.text());
    return (await o.json()).ids;
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/revisions/list */
  async listRevisions(t, s) {
    const r = new URL(`${await this.#e}/${encodeURIComponent(t)}/revisions`), o = await this.#s(r, { signal: s?.signal });
    if (!o.ok)
      throw new Error(`Google Drive listRevisions ${o.status} error: ` + await o.text());
    return o.json();
  }
  /** https://developers.google.com/workspace/drive/api/reference/rest/v3/revisions/get */
  async getRevisionContent(t, s, r) {
    const o = new URL(`${await this.#e}/${encodeURIComponent(t)}/revisions/${encodeURIComponent(s)}`);
    return o.searchParams.set("alt", "media"), this.#s(o, { signal: r?.signal });
  }
}
function ns(e) {
  return {
    type: e.type,
    emailAddress: e.emailAddress,
    role: e.role,
    allowFileDiscovery: e.allowFileDiscovery,
    domain: e.domain,
    expirationTime: e.expirationTime,
    view: e.view,
    pendingOwner: e.pendingOwner,
    inheritedPermissionsDisabled: e.inheritedPermissionsDisabled
  };
}
function N(e) {
  return typeof e == "string" ? { id: e } : e;
}
const os = "X-Goog-Drive-Resource-Keys";
function as(e) {
  const t = [];
  for (const { id: s, resourceKey: r } of e)
    r && !r.match(/[/,]/) && !s.match(/[/,]/) && t.push(`${s}/${r}`);
  if (t.length)
    return t.join(",");
}
const be = "application/vnd.google-apps.folder", is = "application/vnd.breadboard.graph+json", cs = "isShareableCopy", ls = "application/vnd.google-apps.document", ds = "application/vnd.google-apps.spreadsheet", us = "application/vnd.google-apps.presentation";
async function hs(e) {
  const { userFolderName: t, fetchWithCreds: s } = e, r = new le({ fetchWithCreds: s }), o = `name=${ae(t)}
  and mimeType="${be}"
  and 'me' in owners
  and visibility = 'limited'
  and trashed=false`;
  try {
    const a = (await r.listFiles(o, {
      fields: ["id", "mimeType", "shared"],
      orderBy: [{ field: "createdTime", dir: "desc" }]
    })).files.filter(
      (i) => i.mimeType === be && i.shared !== !0
    );
    if (a.length > 0) {
      a.length > 1 && console.warn(
        "[Google Drive] Multiple candidate root folders found, picking the first created one arbitrarily:",
        a
      );
      const i = a[0].id;
      return console.log("[Google Drive] Found existing root folder", i), { ok: !0, id: i };
    }
    return { ok: !1, error: "No root folder found" };
  } catch (n) {
    return console.error("Failed to find root folder", n), {
      ok: !1,
      error: n instanceof Error ? n.message : "Failed to find root folder"
    };
  }
}
async function gs(e) {
  const { isTestApi: t, fetchWithCreds: s } = e, r = new le({ fetchWithCreds: s }), o = `mimeType = ${ae(is)}
and trashed = false
and not properties has {
  key = ${ae(cs)}
  and value = "true"
}
and 'me' in owners
  `;
  try {
    return { ok: !0, files: (await r.listFiles(o, {
      fields: [
        "id",
        "name",
        "modifiedTime",
        "properties",
        "appProperties",
        "isAppAuthorized"
      ],
      orderBy: [{ field: "modifiedTime", dir: "desc" }]
    })).files.filter(
      (i) => (
        // Filter down to graphs created by whatever the current OAuth app is.
        // Otherwise, graphs from different OAuth apps will appear in this list
        // too, and if they are selected, we won't be able to edit them. Note
        // there is no way to do this in the query itself.
        i.isAppAuthorized || // Note when running on testGaia, isAppAuthorized seems to always be false
        // so just allow all files in that case (they should all be from the test
        // client anyway)
        t
      )
    ).map((i) => ({
      ...i,
      // properties and appProperties are always optional from the Drive API
      // (even when requested), but ListDriveFileItem declares them required.
      properties: i.properties ?? {},
      appProperties: i.appProperties ?? {}
    })) };
  } catch (n) {
    return console.error("Failed to list opals", n), {
      ok: !1,
      error: n instanceof Error ? n.message : "Failed to list opals"
    };
  }
}
async function fs(e) {
  const { mimeType: t, connectorId: s, graphId: r, fetchWithCreds: o } = e, n = new le({ fetchWithCreds: o }), i = `appProperties has { key = 'google-drive-connector' and value = '${`${ps(t)}${s}${r}`}' } and trashed = false`;
  try {
    const l = (await n.listFiles(i)).files;
    return l.length > 0 ? { ok: !0, id: l[0].id } : { ok: !0, id: null };
  } catch (c) {
    return console.error("Failed to get drive collector file", c), {
      ok: !1,
      error: c instanceof Error ? c.message : "Failed to get drive collector file"
    };
  }
}
function ps(e) {
  return e === ls ? "doc" : e === ds ? "sheet" : e === us ? "slides" : "";
}
function ae(e) {
  return `'${e.replace(/'/g, "\\'")}'`;
}
function ms(e) {
  return !(e && typeof e == "object" && "$error" in e);
}
function Ms(e, t) {
  return { $error: e, ...t && { metadata: t } };
}
function Y(e) {
  return async (t, s) => {
    const r = new Request(t, s), o = await e(r.url);
    if (!ms(o))
      throw new Error(`Unauthenticated: ${o.$error}`);
    const n = Object.fromEntries(r.headers.entries()), a = new Request(r, {
      headers: {
        ...n,
        Authorization: `Bearer ${o}`
      }
    });
    return fetch(a);
  };
}
const Ae = window.trustedTypes?.createPolicy(
  "opal-analytics-url",
  { createScriptURL: Xe }
), ws = Ae?.createScriptURL.bind(Ae) ?? Xe;
function Xe(e) {
  const t = new URL("https://www.googletagmanager.com/gtag/js");
  return t.searchParams.set("id", e), t.href;
}
async function ys(e) {
  window.dataLayer = window.dataLayer || [], window.gtag = function() {
    window.dataLayer.push(arguments);
  }, window.gtag("js", /* @__PURE__ */ new Date());
  const t = document.createElement("script");
  t.src = ws(e), t.async = !0, document.body.appendChild(t);
  const s = ie(window.location.href).lite ? "lite" : "standard";
  window.gtag("config", e, {
    site_mode: s,
    anonymize_ip: !0,
    cookie_flags: "SameSite=None; Secure"
  });
}
function x() {
  return !window.location.href.includes("localhost:3000");
}
class Es {
  constructor(t) {
    x() && t && (this.initialized = ys(t));
  }
  async setProperties(t) {
    this.initialized && x() && (await this.initialized, globalThis.gtag?.("set", "user_properties", t), globalThis.gtag?.("event", "user_property_update", t));
  }
  async sendEvent(t, s) {
    this.initialized && x() && (await this.initialized, Ss(t, s));
  }
}
function Ss(e, t) {
  x() && globalThis.gtag?.("event", e, t);
}
class Ps {
  constructor(t) {
    this.sendHttpRequest = async (s, r) => {
      const { method: o, body: n, query: a, signal: i } = r;
      let c = `${h.BACKEND_API_ENDPOINT}/v1beta1/${s}`;
      if (console.log(`[backend-client] fetching ${c}`), a) {
        const d = new URLSearchParams(a);
        c += `?${d.toString()}`;
      }
      const l = { method: o, signal: i };
      return n !== void 0 && (l.headers = { "Content-Type": "application/json" }, l.body = JSON.stringify(n)), this.#e(c, l);
    }, this.#e = t;
  }
  #e;
}
const w = "$sign-in", vs = "https://accounts.google.com/o/oauth2/auth", Os = h.GOOGLE_OAUTH_AUTH_ENDPOINT || vs;
class xs {
  constructor() {
    this.#e = ce.restoredInstance(), this.#t = this.#e.then(
      (t) => new Nt(t)
    ), this.#r = this.#t.then(
      (t) => new Lt(
        {
          get: () => t.get(y.CONNECTIONS, w)?.value,
          set: async (s) => t.set(y.CONNECTIONS, w, {
            name: w,
            value: s
          })
        },
        { OAUTH_CLIENT: h.OAUTH_CLIENT }
      )
    ), this.getSignInState = async () => this.#n ??= (async () => {
      const s = (await this.#r).getToken();
      return s.state === "signedout" ? { status: "signedout" } : (s.state, this.#d(s.grant));
    })(), this.validateScopes = async () => {
      const t = await this.#s();
      if (!t.ok)
        return {
          ok: !1,
          code: t.code === "access-revoked" ? "signed-out" : t.code,
          error: t.error
        };
      const s = t.value, r = /* @__PURE__ */ new Set();
      for (const a of s)
        r.add(k(a));
      {
        const a = await this.#t, i = (await a.get(y.CONNECTIONS, w))?.value;
        if (i) {
          const c = JSON.parse(i);
          c.scopes || (console.info("[signin] Upgrading signin storage to include scopes"), await a.set(
            y.CONNECTIONS,
            w,
            {
              name: w,
              value: JSON.stringify({
                ...c,
                scopes: s
              })
            }
          ));
        }
      }
      const n = [...new Set(
        z.map((a) => k(a))
      )].filter(
        (a) => !r.has(a)
      );
      return n.length > 0 ? {
        ok: !1,
        code: "missing-scopes",
        error: `Missing scopes: ${n.join(", ")}`
      } : { ok: !0 };
    }, this.getConfiguration = async () => ({
      consentMessage: "",
      isTestApi: Pe(Ye)?.remappedUrl?.origin === "https://test-www.sandbox.googleapis.com",
      shareSurface: void 0,
      shareSurfaceUrlTemplates: h.SHARE_SURFACE_URL_TEMPLATES
    }), this.fetchWithCreds = async (t, s = {}) => {
      const r = t instanceof Request ? t.url : t instanceof URL ? t.href : t;
      try {
        new URL(r);
      } catch {
        return new Response(
          `Only valid absolute URLs can be used with fetchWithCreds: ${r}`,
          { status: 400 }
        );
      }
      const o = Pe(r);
      if (!o) {
        const c = `URL is not in fetchWithCreds allowlist: ${r}`;
        return console.error(`[shell host] ${c}`), new Response(c, { status: 403 });
      }
      o.remappedUrl && (t = t instanceof Request ? { ...t, url: o.remappedUrl.href } : o.remappedUrl.href);
      const n = await this.#o(o.scopes);
      if (n.state === "signedout")
        return new Response("User is signed-out", { status: 401 });
      if (n.state === "missing-scopes")
        return new Response(
          `User is signed-in but missing scopes: ${n.scopes.join(", ")}`,
          { status: 401 }
        );
      const a = n.grant.access_token;
      o.shouldAddAccessTokenToJsonBody && (s = this.#l(s, a));
      const i = new Headers(s.headers);
      return i.set("Authorization", `Bearer ${a}`), fetch(t, { ...s, headers: i });
    }, this.#a = new Ps(this.fetchWithCreds), this.getOpalBackendClient = async () => Ve(this.#a), this.signIn = async (t = []) => {
      const { url: s, nonce: r } = this.#c(t), o = 900, n = 850, a = window.open(
        s,
        "Sign in to Google",
        `
      width=${o}
      height=${n}
      left=${window.screenX + window.innerWidth / 2 - o / 2}
      top=${window.screenY + window.innerHeight / 2 - n / 2 + /* A little extra to account for the tabs, url bar etc.*/
        60}
      `
      );
      return a ? await this.#g(r, t, a) : this.#h(t);
    }, this.signOut = async () => {
      if ((await this.getSignInState()).status === "signedout")
        return;
      await (await this.#t).delete(y.CONNECTIONS, w), this.#n = Promise.resolve({ status: "signedout" });
    }, this.setUrl = async (t) => {
      const { pathname: s, search: r, hash: o } = new URL(t);
      history.replaceState(
        null,
        "",
        new URL(
          (h.SHELL_PREFIX || "") + s + r + o,
          window.location.origin
        )
      );
    }, this.setTitle = (t) => {
      window.document.title = t ?? "";
    }, this.setOneGoogleBarVisible = (t) => {
    }, this.pickDriveFiles = async (t) => {
      console.info("[shell host] opening drive picker");
      const [s, r] = await Promise.all([
        Ft(),
        this.#o(["https://www.googleapis.com/auth/drive.readonly"])
      ]);
      if (r.state !== "valid")
        return {
          action: "error",
          error: `Could not open drive picker with token state ${r.state}`
        };
      const o = new s.DocsView();
      o.setMimeTypes(t.mimeTypes.join(",")), o.setIncludeFolders(!0), o.setSelectFolderEnabled(!1), o.setOwnedByMe(!0), o.setMode(google.picker.DocsViewMode.GRID);
      const n = new s.DocsView();
      n.setMimeTypes(t.mimeTypes.join(",")), n.setIncludeFolders(!0), n.setSelectFolderEnabled(!1), n.setOwnedByMe(!1), n.setMode(google.picker.DocsViewMode.GRID);
      const a = await new Promise(
        (i) => {
          new s.PickerBuilder().setOrigin(Wt()).addView(o).addView(n).setAppId(r.grant.client_id).setOAuthToken(r.grant.access_token).setCallback((c) => {
            c.action !== "loaded" && i(c);
          }).build().setVisible(!0);
        }
      );
      return console.info("[shell host] drive picker result", a), a.action === "picked" ? { action: "picked", docs: a.docs ?? [] } : a.action === "cancel" ? { action: "cancel" } : a.action === "error" ? { action: "error", error: "Unknown error from drive picker" } : {
        action: "error",
        error: `Unhandled result action ${a.action}`
      };
    }, this.shareDriveFiles = async (t) => {
      const s = this.#o([
        "https://www.googleapis.com/auth/drive.file"
      ]);
      if (!this.#i) {
        const l = await Bt();
        this.#i = new l();
      }
      const r = await s;
      if (r.state !== "valid")
        throw new Error("User is signed-out or doesn't have sufficient scope");
      this.#i.setItemIds(t.fileIds), this.#i.setOAuthToken(r.grant.access_token);
      let o = "opening", n;
      const a = new AbortController(), i = Promise.withResolvers(), c = () => {
        n?.disconnect(), a.abort(), o = "closed", i.resolve();
      };
      n = new MutationObserver(() => {
        const l = document.body.querySelector(
          '[guidedhelpid="drive_share_dialog"]'
        );
        if (l) {
          const d = l.getAttribute("aria-hidden");
          o === "opening" && d !== "true" ? o = "open" : o === "open" && d === "true" && c();
        }
      }), n.observe(document.body, {
        childList: !0,
        attributes: !0,
        subtree: !0
      }), window.addEventListener(
        "keydown",
        ({ key: l }) => {
          l === "Escape" && o === "opening" && c();
        },
        {
          // Capture so that we see this event before the ShareClient.
          capture: !0,
          signal: a.signal
        }
      ), this.#i.showSettingsDialog(), await i.promise;
    }, this.checkAppAccess = async () => {
      const t = await this.#o();
      return t.state === "valid" ? await this.#u(t.grant.access_token) : {
        canAccess: !1,
        accessStatus: "ACCESS_STATUS_UNSPECIFIED"
      };
    }, this.sendToEmbedder = async (t) => {
      Ze(t);
    }, this.findUserOpalFolder = async () => {
      const t = await this.#o([
        "https://www.googleapis.com/auth/drive.readonly"
      ]);
      if (t.state !== "valid")
        return {
          ok: !1,
          error: "User is signed out or doesn't have sufficient scope"
        };
      const s = h.GOOGLE_DRIVE_USER_FOLDER_NAME || "Breadboard";
      return hs({
        userFolderName: s,
        fetchWithCreds: Y(
          async () => t.grant.access_token
        )
      });
    }, this.listUserOpals = async () => {
      const t = await this.#o([
        "https://www.googleapis.com/auth/drive.readonly"
      ]);
      if (t.state !== "valid")
        return {
          ok: !1,
          error: "User is signed out or doesn't have sufficient scope"
        };
      const s = !!(await this.getConfiguration()).isTestApi;
      return gs({
        isTestApi: s,
        fetchWithCreds: Y(
          async () => t.grant.access_token
        )
      });
    }, this.getDriveCollectorFile = async (t, s, r) => {
      const o = await this.#o([
        "https://www.googleapis.com/auth/drive.readonly"
      ]);
      return o.state !== "valid" ? {
        ok: !1,
        error: "User is signed out or doesn't have sufficient scope"
      } : fs({
        mimeType: t,
        connectorId: s,
        graphId: r,
        fetchWithCreds: Y(
          async () => o.grant.access_token
        )
      });
    }, this.trackAction = async (t, s) => {
      this.actionEventSender?.sendEvent(t, s);
    }, this.trackProperties = async (t) => {
      this.actionEventSender?.setProperties(t);
    }, this.showCookieSettings = async () => {
      document.querySelector(
        ".glue-cookie-notification-bar-control"
      )?.click(), requestAnimationFrame(() => {
        document.activeElement?.blur();
      });
    }, this.cookieBarRequired = Promise.resolve(!1), this.isCookieSettingsAvailable = async () => this.cookieBarRequired;
  }
  #e;
  #t;
  #r;
  #n;
  /** See https://cloud.google.com/docs/authentication/token-types#access */
  async #s() {
    const t = new URL("https://oauth2.googleapis.com/tokeninfo");
    let s;
    try {
      s = await this.#o();
    } catch (n) {
      return { ok: !1, code: "signed-out", error: String(n) };
    }
    if (s.state === "signedout")
      return { ok: !1, code: "signed-out", error: "User was signed out" };
    t.searchParams.set("access_token", s.grant.access_token);
    let r;
    try {
      r = await fetch(t);
    } catch (n) {
      return { ok: !1, code: "other", error: `Network error: ${n}` };
    }
    if (!r.ok) {
      try {
        const n = await r.json();
        if (n.error === "invalid_token")
          return {
            ok: !1,
            code: "access-revoked",
            error: JSON.stringify(n)
          };
        console.debug("Unhandled tokeninfo error", n);
      } catch {
      }
      return {
        ok: !1,
        code: "other",
        error: `HTTP ${r.status} error`
      };
    }
    let o;
    try {
      o = await r.json();
    } catch (n) {
      return { ok: !1, code: "other", error: `JSON parse error: ${n}` };
    }
    return { ok: !0, value: o.scope.split(" ") };
  }
  /**
   * Adds the access token to the body of the request.
   */
  #l(t, s) {
    const r = t.body;
    if (typeof r != "string")
      return console.warn("When augmenting request, body is not string, bailing..."), t;
    try {
      const o = JSON.parse(r);
      return {
        ...t,
        body: JSON.stringify({ ...o, accessToken: s })
      };
    } catch {
      return console.warn(
        "When augmenting request, body is not JSON parsable, bailing"
      ), t;
    }
  }
  #a;
  #c(t = []) {
    console.info("[shell host] Generating sign-in URL and nonce");
    const s = crypto.randomUUID(), r = [
      .../* @__PURE__ */ new Set([...z, ...t])
    ], o = new URL(Os), n = o.searchParams;
    return n.set("client_id", h.OAUTH_CLIENT), n.set("redirect_uri", new URL("/oauth/", window.location.origin).href), n.set("scope", r.join(" ")), n.set(
      "state",
      JSON.stringify({ nonce: s })
    ), n.set("response_type", "code"), n.set("access_type", "offline"), n.set("prompt", "consent"), n.set("include_granted_scopes", "true"), { url: o.href, nonce: s };
  }
  /**
     * Display a sign-in dialog as fallback for when we were blocked from
     * immediately calling window.open.
  
     * Safari has a much shorter navigator.userActivation.isActive timeout than
     * Chrome and Firefox, which means that too much time can elapse between the
     * guest asking for a sign-in and the host calling window.open.
     */
  #h(t) {
    const s = document.createElement("dialog");
    s.id = "fallback-sign-in-dialog";
    const r = document.createElement("h1");
    r.textContent = "Sign in to use Opal", s.appendChild(r);
    const o = document.createElement("p");
    o.textContent = "To continue, you'll need to sign in with your Google account.", s.appendChild(o);
    const n = document.createElement("button");
    return n.appendChild(document.createTextNode("Sign in with Google")), s.appendChild(n), s.addEventListener("close", () => s.remove(), { once: !0 }), document.body.appendChild(s), new Promise((a) => {
      n.addEventListener(
        "click",
        () => {
          s.close(), a(this.signIn(t));
        },
        { once: !0 }
      ), s.showModal();
    });
  }
  async #g(t, s, r) {
    console.info("[shell host] Awaiting grant response");
    const o = new AbortController(), n = await new Promise((S) => {
      window.addEventListener(
        "message",
        (m) => {
          m.isTrusted && m.source === r && m.origin === window.location.origin && typeof m.data == "object" && m.data !== null && m.data.type === et && (S(m.data), o.abort());
        },
        { signal: o.signal }
      );
    });
    if (n.nonce !== t)
      return {
        ok: !1,
        error: { code: "other", userMessage: "Verification failed" }
      };
    if (n.error !== void 0)
      return n.error === "access_denied" ? (console.info("[shell host] User cancelled sign-in"), { ok: !1, error: { code: "user-cancelled" } }) : (console.error("[shell host] Unknown grant error", n.error), {
        ok: !1,
        error: {
          code: "other",
          userMessage: `Unknown grant error ${JSON.stringify(n.error)}`
        }
      });
    if (!n.code)
      return console.error("[shell host] Missing authorization code", n), {
        ok: !1,
        error: { code: "other", userMessage: "Missing authorization code" }
      };
    const a = new URL("/connection/grant/", window.location.origin), i = await fetch(a, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        code: n.code,
        redirect_path: n.redirectPath ?? "/oauth/"
      })
    });
    let c;
    try {
      c = await i.json();
    } catch {
      c = {
        error: "Invalid response from connection server"
      };
    }
    c.error === void 0 && (c.scopes = n.scopes ?? [], c.authuser = n.authuser);
    const l = Date.now();
    if (console.info("[shell host] Received grant response"), c.error !== void 0)
      return console.error("[shell host] Unknown grant error", c.error), {
        ok: !1,
        error: {
          code: "other",
          userMessage: `Unknown grant error ${JSON.stringify(c.error)}`
        }
      };
    if (!c.access_token)
      return console.error("[shell host] Missing access token", c), {
        ok: !1,
        error: { code: "other", userMessage: "Missing access token" }
      };
    console.info("[shell host] Checking geo restriction");
    try {
      if (!(await this.#u(
        c.access_token
      )).canAccess)
        return console.info("[shell host] User is geo restricted"), { ok: !1, error: { code: "geo-restriction" } };
    } catch (S) {
      return console.error("[shell host] Error checking geo access", S), {
        ok: !1,
        error: { code: "other", userMessage: "Error checking geo access" }
      };
    }
    const d = s.length ? s : z, f = new Set(c.scopes ?? []), u = d.filter(
      (S) => !f.has(S)
    );
    if (u.length > 0)
      return console.info("[shell host] Missing scopes", u), {
        ok: !1,
        error: { code: "missing-scopes", missingScopes: u }
      };
    const E = {
      client_id: h.OAUTH_CLIENT,
      access_token: c.access_token,
      expires_in: c.expires_in,
      issue_time: l,
      name: c.name,
      picture: c.picture,
      id: c.id,
      domain: c.domain,
      scopes: c.scopes,
      authuser: c.authuser
    };
    console.info("[shell host] Updating storage");
    const Qe = await this.#t, de = () => Qe.set(y.CONNECTIONS, w, {
      name: w,
      value: JSON.stringify(E)
    });
    try {
      await de();
    } catch (S) {
      console.warn(
        "[shell host] Error updating storage, deleting storage and retrying:",
        S
      );
      try {
        await (await this.#e).delete(), await de();
      } catch (m) {
        return console.error(
          "[shell host] Error updating storage even after deleting:",
          m
        ), {
          ok: !1,
          error: {
            code: "other",
            userMessage: "Error updating storage after delete"
          }
        };
      }
    }
    const ue = this.#d(E);
    return this.#n = Promise.resolve(ue), console.info("[shell host] Sign-in complete"), { ok: !0, state: ue };
  }
  #d(t) {
    return t.authuser === void 0 && console.warn(
      "[shell host] authuser is not available in stored sign-in data. User will need to sign out and sign back in to populate authuser and access G1 status."
    ), {
      status: "signedin",
      id: t.id,
      name: t.name,
      picture: t.picture,
      domain: t.domain,
      scopes: (t.scopes ?? []).map(
        (s) => k(s)
      ),
      authuser: t.authuser
    };
  }
  async #o(t) {
    let r = (await this.#r).getToken();
    if (r.state === "expired" && (r = await r.refresh()), r.state === "valid" && t?.length) {
      const o = new Set(
        (r.grant.scopes ?? []).map((a) => k(a))
      ), n = t.filter(
        (a) => !o.has(k(a))
      );
      if (n.length)
        return { state: "missing-scopes", scopes: n };
    }
    return r;
  }
  /**
   * Re-use the same ShareClient instance across all calls to
   * {@link shareDriveFiles} because it always dumps bunch of new DOM into the
   * body every time it's opened, and never cleans it up.
   */
  #i;
  async #u(t) {
    if ((await this.getConfiguration()).isTestApi)
      return console.info(
        "[shell host] Using test gaia; Skipping geo restriction check"
      ), { canAccess: !0, accessStatus: "ACCESS_STATUS_OK" };
    const s = async () => {
      const i = await fetch(
        new URL(
          "/v1beta1/checkAppAccess",
          h.BACKEND_API_ENDPOINT
        ),
        { headers: { Authorization: `Bearer ${t}` } }
      );
      if (!i.ok)
        throw new Error(
          `HTTP ${i.status} error checking geo restriction`
        );
      return await i.json();
    }, r = 4, o = 5e3;
    let n = 0, a = 1e3;
    for (; ; )
      try {
        return await s();
      } catch (i) {
        if (n++, n < r)
          console.log(
            `[shell host] checkAppAccess error, retrying in ${a}ms.`,
            i
          ), await new Promise((c) => setTimeout(c, a)), a = Math.min(a * 1.5, o);
        else
          throw console.log(
            "[shell host] checkAppAccess error, too many retries.",
            i
          ), i;
      }
  }
  /**
   * Enable analytics tracking. Called by the shell host after cookie consent
   * has been granted.
   */
  enableAnalytics() {
    this.actionEventSender || (this.actionEventSender = new Es(
      h.MEASUREMENT_ID
    ));
  }
}
function $s(...e) {
  return { type: "error", args: e };
}
function Fs(...e) {
  return { type: "info", args: e };
}
function Gs(...e) {
  return { type: "verbose", args: e };
}
function Bs(...e) {
  return { type: "warning", args: e };
}
function js(e, ...t) {
  return { type: "group", title: e, args: t };
}
let D = null;
function Ws(e) {
  return D || (D = new Rs(), D);
}
class Rs {
  log(t, s = "") {
    let r = "";
    t.type === "group" && (r = t.title ?? ""), this.logItem(t.type, r, s, ...t.args);
  }
  logItem(t, s, r, ...o) {
    let a, i = console.log;
    switch (t) {
      case "warning":
        a = "\x1B[43;97m", i = console.warn;
        break;
      case "error":
        a = "\x1B[41;97m", i = console.error;
        break;
      case "info":
        a = "\x1B[104;97m", i = console.info;
        break;
      case "verbose":
        a = "\x1B[42;97m", i = console.debug;
        break;
      case "group":
        a = "\x1B[104;97m", i = console.log;
        break;
    }
    const c = `[${a} ${r}${s ? `: ${s}` : ""} \x1B[m]`;
    if (t === "group") {
      console.groupCollapsed(c), i.call(console, ...o), console.groupEnd();
      return;
    }
    i.call(console, c, ...o);
  }
}
export {
  Ts as A,
  Dt as B,
  _e as C,
  Is as D,
  js as E,
  _s as F,
  zt as G,
  Cs as H,
  ve as I,
  Xt as J,
  Yt as K,
  Kt as L,
  we as M,
  Qt as N,
  re as O,
  Oe as P,
  Ps as Q,
  Us as S,
  xs as a,
  St as b,
  $s as c,
  Ns as d,
  Be as e,
  Ds as f,
  Ws as g,
  pt as h,
  Fs as i,
  Ms as j,
  ms as k,
  Ce as l,
  Ls as m,
  k as n,
  W as o,
  ie as p,
  Ye as q,
  bs as r,
  qt as s,
  le as t,
  ke as u,
  Gs as v,
  Bs as w,
  it as x,
  Re as y,
  As as z
};
