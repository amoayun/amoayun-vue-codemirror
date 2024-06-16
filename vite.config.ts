import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { compression } from "vite-plugin-compression2";
import { createHtmlPlugin } from "vite-plugin-html";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    compression({
      threshold: 1024 * 5,
      skipIfLargerOrEqual: true,
      deleteOriginalAssets: true,
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: require("./package.json").name || "Vite App",
        }
      }
    }),
    AutoImport({}),
    Components({}),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
    extensions: [".vue", ".ts", ".js", ".tsx", ".jsx", ".mjs", ".json"]
  },
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "src/vue-codemirror.ts"),
      name: "@amoayun/vue-codemirror",
      fileName: (format, entryName) => `@amoayun/${entryName}.${format}.js`
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: { vue: "Vue" },
        // manualChunks: {
        //   codemirror: [
        //     "codemirror",
        //     "vue-codemirror6",
        //     "@codemirror/theme-one-dark",
        //     "@codemirror/autocomplete"
        //   ],
        //   "codemirror-lang": [
        //     "@codemirror/lang-java",
        //     "@codemirror/lang-javascript",
        //     "@codemirror/lang-json",
        //     "@codemirror/lang-python",
        //     "@codemirror/lang-sql",
        //   ]
        // },
        // Static resource classification and packaging
        // chunkFileNames: "assets/js/[name]-[hash].js",
        // entryFileNames: "assets/js/[name]-[hash].js",
        // assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    }
  }
})
