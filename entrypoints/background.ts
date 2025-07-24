export default defineBackground(() => {
  // Executed when background is loaded
  console.log('Hello background!!!!', { id: browser.runtime.id });

  // 首次安装扩展时，打开欢迎页面
  browser.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason !== "install") return;

    // Open a tab on install
    await browser.tabs.create({
      url: browser.runtime.getURL("/get-started.html"),
      active: true, // default is true
    });
  });

  // 当点击 action 时，如果当前 tab 显示的是 chatgpt.com 页面，则将该页面的输入框的上面加上一行字（我是执行脚本注入到这里来的）
  browser.action.onClicked.addListener(async (tab) => {
    if (tab.id && tab.url?.includes("chatgpt.com")) {
      const res = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['/content-scripts/content.js'],
        // func: () => {
        //   const input = document.querySelector("textarea");
        //   if (input) {
        //     input.value = "我是执行脚本注入到这里来的";
        //   }
        // },
      });
      console.log("res", res);
    }
  });
});
