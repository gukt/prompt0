export default defineContentScript({
  matches: ['*://*.wxt.dev/*'],
  main(ctx) {
    console.log('Script was executed!', ctx);
    return "Hello John!";
  },
});