import type { AstroI18nextConfig } from "astro-i18next";

const config: AstroI18nextConfig = {
  defaultLocale: "pt",
  locales: ["pt", "en"],
  namespaces: ["common", "blog", "about", "contact"],
  defaultNamespace: "common",
  routes: {
    en: {
      sobre: "about",
      blog: "blog",
    },
  },
};

export default config;
