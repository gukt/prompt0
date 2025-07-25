import ReactDOM from 'react-dom/client';
import App from './App.tsx';

export default defineContentScript({
  matches: ['*://*.wxt.dev/*'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: '.VPSidebar',
      onMount: (contianer) => {
        console.log('onMount', contianer);
        const root = ReactDOM.createRoot(contianer);
        root.render(App()); // 官方文档中用的是 <App />，但是会报错，所以用 App()
        return root;
      },
      onRemove: (root) => {
        console.log('onRemove', root);
      },
    });

    // 调用 ui.mount 挂载 UI 到 DOM 中
    ui.mount();
  },
});