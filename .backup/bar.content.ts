export default defineContentScript({
  matches: ['*://*.wxt.dev/*'],
  main(ctx) {
    console.log('[bar] Content script was executed!', ctx);
  },
});