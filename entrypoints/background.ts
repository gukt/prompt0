export default defineBackground(() => {
  // Executed when background is loaded
  console.log('Hello background!!!!', { id: browser.runtime.id });

  // // 首次安装扩展时，打开欢迎页面
  // browser.runtime.onInstalled.addListener(async ({ reason }) => {
  //   if (reason !== "install") return;

  //   // Open a tab on install
  //   await browser.tabs.create({
  //     url: browser.runtime.getURL("/get-started.html"),
  //     active: true, // default is true
  //   });
  // });

  // 当点击 action 时，在任何页面显示 sidebar
  browser.action.onClicked.addListener(async (tab) => {
    if (tab.id) {
      // 向当前 tab 发送消息，触发 sidebar 显示
      try {
        await browser.tabs.sendMessage(tab.id, { action: 'toggle-sidebar' });
      } catch (error) {
        console.log('无法向页面发送消息，可能是受限页面:', error);
      }
    }
  });
});
