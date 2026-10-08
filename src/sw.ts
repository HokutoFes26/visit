/// <reference lib="webworker" />
import { clientsClaim, cacheNames, setCacheNameDetails } from "workbox-core";
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  getCacheKeyForURL,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<string | { url: string; revision?: string | null }>;
};

setCacheNameDetails({ prefix: "factory-visit" });
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);
cleanupOutdatedCaches();
registerRoute(
  new NavigationRoute(
    createHandlerBoundToURL(
      new URL("index.html", self.registration.scope).href,
    ),
  ),
);
clientsClaim();

// Registration alone is insufficient: confirm every required precache entry exists.
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data?.type === "CHECK_OFFLINE_READY") {
    event.waitUntil(
      (async () => {
        let ready = false;
        try {
          const cache = await caches.open(cacheNames.precache);
          const checks = await Promise.all(
            manifest.map(async (entry) => {
              const key = getCacheKeyForURL(
                typeof entry === "string" ? entry : entry.url,
              );
              return key ? !!(await cache.match(key)) : false;
            }),
          );
          ready = checks.length > 0 && checks.every(Boolean);
        } catch {
          /* Report failure instead of claiming readiness. */
        }
        event.ports[0]?.postMessage({ ready });
      })(),
    );
  }
});
