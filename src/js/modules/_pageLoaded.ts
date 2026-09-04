/**
 * ページ読み込み完了後に
 * data-page-loaded を持つ要素へ is-loaded を付与する
 */
export default class PageLoaded {
  private readonly selector = "[data-page-loaded]";
  private readonly activeClass = "is-loaded";

  constructor() {
    this.init();
  }

  private init(): void {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.apply());
    } else {
      this.apply();
    }
  }

  private apply(): void {
    const elements = document.querySelectorAll<HTMLElement>(this.selector);

    if (!elements.length) return;

    elements.forEach((element) => {
      element.classList.add(this.activeClass);
    });
  }
}
