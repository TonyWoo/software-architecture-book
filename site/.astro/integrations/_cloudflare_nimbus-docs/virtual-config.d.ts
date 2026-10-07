declare module "virtual:nimbus/config" {
  import type { NimbusConfig, VersionAlternatesTable } from "@cloudflare/nimbus-docs/types";
  export const config: NimbusConfig;
  /** Build-time list of indexable collection names. See `getIndexedEntries()`. */
  export const indexedCollections: readonly string[];
  /** Collections whose canonical routes render on request. Build-only. */
  export const requestRenderingCollections: readonly string[];
  /** Build-time cross-version alternates table. See `getVersionAlternates()`. */
  export const versionAlternates: VersionAlternatesTable;
  /** Subset of `indexedCollections` that are OpenAPI reference collections. Server-only. */
  export const apiCollections: readonly string[];
  /** Build-time defaults derived from Astro's public directory. */
  export const headDefaults: { favicon: { file: string; type: string }; socialImage: string };
}
