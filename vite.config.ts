import {defineConfig} from "vite";
import {lingui} from "@lingui/vite-plugin";
import react from "@vitejs/plugin-react";
import {copy} from "vite-plugin-copy";
import path from "node:path";

export default defineConfig({
    optimizeDeps: {
        include: ["react-router"]
    },
    server: {
        hmr: {
            port: 24678,
            protocol: "ws",
        },
    },
    plugins: [
        lingui(),
        react({
            babel: {
                plugins: ["@lingui/babel-plugin-lingui-macro"],
            },
        }),
        copy({
            targets: [{src: "src/embed/widget.js", dest: "public"}],
            hook: "writeBundle",
        }),
    ],
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
    define: {
        "process.env": process.env,
    },
    ssr: {
        noExternal: ["react-helmet-async"],
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
            }
        }
    }
});
