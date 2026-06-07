import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const homelabPreset = require("@jdcpuwiz/homelab-ui/tailwind-preset");

/**
 * __APP_NAME__ — Tailwind config. All theme tokens come from the
 * @jdcpuwiz/homelab-ui preset. Override per-app via :root CSS variables
 * in app/globals.css (e.g. `--hl-sidebar-width: 18rem`).
 */
const config: Config = {
  darkMode: "class",
  presets: [homelabPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/@jdcpuwiz/homelab-ui/dist/**/*.{js,mjs,cjs}",
  ],
};

export default config;
