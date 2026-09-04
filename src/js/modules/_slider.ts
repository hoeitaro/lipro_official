import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";

/**
 * スライダーを初期化する（768px未満でのみ有効）
 * @param {string} selector - スライダーコンテナのセレクタ
 */
export function initSlider(selector = ".js-definition-slider") {
  const containers = document.querySelectorAll<HTMLElement>(selector);

  containers.forEach((container) => {
    const wrapper = container.querySelector<HTMLElement>(".swiper-wrapper");
    if (!wrapper) return;

    const nextEl = container.querySelector<HTMLElement>(".swiper-button-next");
    const prevEl = container.querySelector<HTMLElement>(".swiper-button-prev");
    const paginationEl =
      container.querySelector<HTMLElement>(".swiper-pagination");
    if (!paginationEl) return;

    const originalSlides = Array.from(wrapper.children) as HTMLElement[];
    const originalCount = originalSlides.length;

    let swiper: Swiper | null = null;

    /**
     * スライダーを有効化
     */
    const enableSlider = () => {
      // すでに初期化済みなら何もしない
      if (swiper) return;

      // スライド数が6未満なら複製（すでに複製済みでない場合のみ）
      if (wrapper.children.length === originalCount && originalCount < 6) {
        const targetCount = originalCount * 2;
        for (let i = originalCount; i < targetCount; i++) {
          const clone = originalSlides[i % originalCount].cloneNode(true);
          wrapper.appendChild(clone);
        }
      }

      swiper = new Swiper(container, {
        modules: [Navigation, Pagination],
        centeredSlides: true,
        slidesPerView: 2.3,
        speed: 500,
        spaceBetween: 10,
        loop: true,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl,
          prevEl,
        },
        pagination: {
          el: paginationEl,
          clickable: true,
          renderBullet: (index, className) =>
            index < originalCount ? `<span class="${className}"></span>` : "",
        },
      });

      // ページネーション同期
      swiper.on("slideChange", () => {
        if (!swiper) return;
        const realIndex = swiper.realIndex % originalCount;
        swiper.pagination.bullets.forEach((bullet, i) => {
          bullet.classList.toggle(
            "swiper-pagination-bullet-active",
            i === realIndex,
          );
        });
      });
    };

    /**
     * スライダーを無効化
     */
    const disableSlider = () => {
      // Swiper破棄
      if (swiper) {
        swiper.destroy(true, true);
        swiper = null;
      }

      // 複製スライドがある場合、元の枚数まで戻す
      const currentSlides = Array.from(wrapper.children);
      if (currentSlides.length > originalCount) {
        currentSlides.slice(originalCount).forEach((el) => el.remove());
      }
    };

    /**
     * メディアクエリ監視
     */
    const mql = window.matchMedia("(max-width: 767px)");

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        enableSlider();
      } else {
        disableSlider();
      }
    };

    // 初回チェック
    handleMediaChange(mql);

    // 変更監視（パフォーマンスが良い）
    mql.addEventListener("change", handleMediaChange);
  });
}
