export type HeaderToggleOptions = {
  headerSelector?: string;
  targetSelector?: string;
  className?: string;
  debug?: boolean;
};

export function initHeaderToggle(options: HeaderToggleOptions = {}) {
  const {
    headerSelector = ".js-header",
    targetSelector = ".p-top-kv",
    className = "is-scrolled-past",
    debug = false,
  } = options;

  const header = document.querySelector<HTMLElement>(headerSelector);

  // p-top-kv の"中身"を監視するため、firstElementChild を安全に取得
  const targetWrapper = document.querySelector<HTMLElement>(targetSelector);
  const target = targetWrapper?.firstElementChild as HTMLElement | null;

  // 존재チェック
  if (!header || !target) {
    if (debug)
      console.warn("[headerToggle] header または target が見つかりません");
    return { destroy: () => {} };
  }

  let observer: IntersectionObserver | null = null;
  let rafId: number | null = null;
  let runningFallback = false;

  const add = () => header.classList.add(className);
  const remove = () => header.classList.remove(className);

  const ioCallback: IntersectionObserverCallback = (entries) => {
    for (const entry of entries) {
      const bottom = entry.boundingClientRect.bottom;
      if (bottom <= 0) add();
      else remove();
    }
  };

  const fallbackTick = () => {
    rafId = null;
    const rect = target.getBoundingClientRect();
    if (rect.bottom <= 0) add();
    else remove();
  };

  const onScrollFallback = () => {
    if (rafId == null) rafId = requestAnimationFrame(fallbackTick);
  };

  const init = () => {
    if ("IntersectionObserver" in globalThis) {
      observer = new IntersectionObserver(ioCallback, {
        root: null,
        threshold: [0],
      });
      observer.observe(target);
      if (debug) console.log("[headerToggle] using IntersectionObserver");
    } else {
      runningFallback = true;
      fallbackTick();
      globalThis.addEventListener("scroll", onScrollFallback, {
        passive: true,
      });
      globalThis.addEventListener("resize", onScrollFallback, {
        passive: true,
      });
      if (debug) console.log("[headerToggle] using scroll fallback");
    }
  };

  const destroy = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (runningFallback) {
      globalThis.removeEventListener("scroll", onScrollFallback);
      globalThis.removeEventListener("resize", onScrollFallback);
      runningFallback = false;
    }
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    remove();
    if (debug) console.log("[headerToggle] destroyed");
  };

  init();

  return { destroy };
}

export default initHeaderToggle;
