export default defineContentScript({
  matches: ['*://*.wxt.dev/*'],
  main(ctx) {
    console.log('Hello content.', ctx);
  },
});
