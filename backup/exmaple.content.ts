// https://wxt.dev/guide/essentials/content-scripts.html
export default defineContentScript({
  matches: ['<all_urls>'],
  main(ctx) {
    console.log('ctx from content script', ctx);
    console.log('This is a example content script.');
  },
});