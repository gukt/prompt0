// 这里比较神奇，可以自动获取到 HTML 中的元素，不需要传统的那种通过 document.getElementById 获取
// 但是要注意，如果 HTML 中没有这个元素，则不会自动获取到，会报错
declare const closeBtn: HTMLButtonElement;
declare const title: HTMLHeadingElement;
declare const content: HTMLParagraphElement;
declare const notFound: HTMLParagraphElement; // No such element

title.textContent = 'Welcome to WXT!(Changed in main.ts)';
content.textContent = 'Get started content...(Changed in main.ts)';
// 这里会报错: Uncaught ReferenceError: notFound is not defined
// notFound.textContent = 'Not found...(Changed in main.ts)';

closeBtn.onclick = () => {
  window.close();
};
