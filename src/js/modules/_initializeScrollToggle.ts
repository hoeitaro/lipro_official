export const initScrollToggle = (selector = "[data-scroll-toggle]") => {
  const targets = document.querySelectorAll<HTMLElement>(selector);

  if (!targets.length) return;

  const toggleClass = () => {
    const isScrolled = window.scrollY > window.innerHeight;

    targets.forEach((el) => {
      el.classList.toggle("is-scrolled", isScrolled);
    });
  };

  // 初期判定
  toggleClass();

  // スクロール監視
  window.addEventListener("scroll", toggleClass, { passive: true });
};
