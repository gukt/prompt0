export default defineContentScript({
  matches: ["<all_urls>"],
  main(ctx) {
    console.log("iframe.content", ctx);

    // Define the UI
    const ui = createIframeUi(ctx, {
      page: '/example-iframe.html',
      position: 'inline',
      anchor: 'body',
      append: 'first',
      onMount: (wrapper, iframe) => {
        console.log('onMount', wrapper, iframe);
        // Add styles to the iframe like width
        iframe.width = '123';
      },
    });

    // Mount the UI (Show UI to user)
    ui.mount();
  },
});