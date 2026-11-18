const a = {
  mcp: !1,
  force2DGraph: !1,
  consistentUI: !1,
  opalAdk: !1,
  outputTemplates: !1,
  googleOne: !1,
  enableResumeAgentRun: !1,
  enableNotebookLm: !1,
  enableGraphEditorAgent: !1,
  enableDevTools: !1,
  textEditorRemix: !1,
  showTokenCounter: !1,
  enableOpalBackend: !1,
  enableSessionsBackend: !1,
  enableSingletonPrefixCache: !1,
  enableAssetAccessConsent: !1,
  enableBackendGraphRunner: !1,
  enableAgentWorkbench: !1
};
function o(e) {
  return {
    BACKEND_API_ENDPOINT: "http://localhost:3000",
    ...e,
    flags: { ...a, ...e?.flags }
  };
}
function l() {
  const e = globalThis.document?.querySelector("template")?.content?.firstElementChild?.textContent;
  if (!e)
    return console.warn(
      "Failed to discover deployment config: DOM element not found."
    ), o({});
  try {
    return o(JSON.parse(e));
  } catch (n) {
    return console.warn("Failed to discover deployment config:", n.message), o({});
  }
}
const f = l(), t = (
  // TODO(b/466454650) Rename ALLOWED_REDIRECT_ORIGINS to ALLOWED_EMBEDDER_ORIGINS.
  new Set(f.ALLOWED_REDIRECT_ORIGINS ?? [])
), s = t.size && window.self !== window.top ? window.top : void 0;
function i(e) {
  if (s)
    for (const n of t)
      s.postMessage(e, n);
}
function r(e) {
  s && window.addEventListener("message", (n) => {
    t.has(n.origin) && e(n.data);
  });
}
const c = "oauth-popup-message";
export {
  f as C,
  c as O,
  r as a,
  i as s
};
