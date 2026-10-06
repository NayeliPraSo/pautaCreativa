// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://pautacreativa.com.mx",

  //base: process.env.ASTRO_BASE ?? "/nuevositio/",
  base: process.env.ASTRO_BASE ?? "/pautaCreativa/",

  integrations: [sitemap()],
});