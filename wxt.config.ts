import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  // WXT 为最流行的前端框架提供了预配置模块
  // https://wxt.dev/guide/essentials/frontend-frameworks.html#built-in-modules
  modules: ["@wxt-dev/module-react"],
  // 配置别名
  // alias: {
  //   "@": "./",
  // },
  // 如果你的框架没有官方的 WXT 模块，别担心！WXT 通过 Vite 插件支持任何框架。
  // 比如 Tailwind CSS 的支持就是通过 Vite 插件实现的。
  // https://wxt.dev/guide/essentials/frontend-frameworks.html#adding-vite-plugins
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  // https://wxt.dev/guide/essentials/content-scripts.html#iframe
  manifest: {
    permissions: [
      "storage",
      "unlimitedStorage"
    ],
    web_accessible_resources: [
      {
        resources: ["example-iframe.html", "sidebar-ui.html"],
        matches: ["<all_urls>"],
      },
    ],
  },
});
