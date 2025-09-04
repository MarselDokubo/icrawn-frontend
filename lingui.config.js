import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en"], // Add more locales as needed
  catalogs: [
    {
      path: "./src/locales/{locale}",
      include: ["src"],
    },
  ],
});
