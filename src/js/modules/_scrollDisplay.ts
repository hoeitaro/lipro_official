export const initScrollDisplay = (selector = ".js-scrollDisplay") => {
  const pageTop = document.querySelector<HTMLElement>(selector);

  if (!pageTop) return;

  const onScroll = () => {
    if (window.scrollY > window.innerHeight) {
      pageTop.classList.add("is-visible");
    } else {
      pageTop.classList.remove("is-visible");
    }
  };

  // 初期判定
  onScroll();

  // スクロール監視（passive でパフォーマンス向上）
  window.addEventListener("scroll", onScroll, { passive: true });
};
