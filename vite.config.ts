import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import packageJson from "./package.json";

export default defineConfig(({ mode }) => {
  return {
    build: {
      outDir: `dist/${mode === "devbuild" ? "dev" : "prod"}/`,
      lib: {
        entry: resolve(__dirname, "src/lib.ts"),
        name: "test",
        fileName: (format) => `[name].${format === "cjs" ? "" : "m"}js`,
        formats: ["es", "cjs"],
      },
      sourcemap: true,
      minify: false,
      emptyOutDir: false,
      rollupOptions: {
        external: (id) => {
          if (id.includes("xstate")) {
            return false;
          }
          return externals.includes(id);
        },
        output: {
          preserveModules: true,
          preserveModulesRoot: "src",
        },
      },
    },
    define: {
      __HYDROGEN_DEV__: mode === "devbuild" || mode === "test",
      __HYDROGEN_TEST__: mode === "test",
    },
    plugins: [react()],
    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: "./vitest.setup.ts",
      restoreMocks: true,
    },
  };
});

const externals = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies),
  "react/jsx-runtime",
];
