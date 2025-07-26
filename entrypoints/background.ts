export default defineBackground(() => {
  // 监听 popup 的打开事件
  browser.action.onClicked.addListener((tab) => {
    // Check auth status and open popup or toggle memory UI
    browser.storage.sync.get(["apiKey", "access_token"], function (data) {
      if (data.apiKey || data.access_token) {
        browser.tabs.sendMessage(tab.id!, { action: "toggleMemoryUI" });
      } else {
        browser.action.openPopup();
      }
    });
  });


  // Initial setting when extension is installed or updated
  browser.runtime.onInstalled.addListener(() => {
    browser.storage.sync.set({ memory_enabled: true }, function () {
      console.log('Memory enabled set to true on install/update');
    });
  });


  // Keep the existing message listener for opening dashboard
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openDashboard") {
      browser.tabs.create({ url: request.url });
    }
  });
});