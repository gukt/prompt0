import { ContentScriptContext } from '#imports';
import './style.css';

export default defineContentScript({
  // 指定内容脚本如何被注册？
  // 默认值为 manifest
  // 由于本例我们需要动态地通过程序来执行脚本，所以这里设置为 runtime，请见该属性的文档。
  registration: "runtime",
  matches: [],
  // Put the CSS in the shadow root
  // 将 CSS 注入到 shadow root 中，而不是直接注入到页面中
  // 因为本例我们将会使用 createShadowRootUi 创建一个 UI
  cssInjectionMode: "ui",
  async main(ctx) {
    console.log("chatgpt.content", ctx);

    const ui = await createUi(ctx);
    ui.mount();

    // Optionally, return a value to the background
    return 'Hello World';
  },
});

function createUi(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: "active-tab-ui",
    position: "inline",
    append: "before",
    onMount(container) {
      const app = document.createElement("p");
      app.textContent = "Hello active tab!";
      container.append(app);
    },
  });
}