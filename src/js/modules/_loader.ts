export const initLoader = (): void => {
  const loader = document.querySelector<HTMLElement>(".js-loader");
  if (!loader) return;

  let safeLocalStorage: Storage | null = null;

  try {
    safeLocalStorage = localStorage;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Web Storage が使えない場合のフォールバック処理
    loader.classList.add("is-hidden");
    document.body.classList.add("loader-page");
    document.body.classList.add("loader-active");
    document.getElementById("about")?.classList.add("is-show");
    return;
  }

  if (!safeLocalStorage) return;

  // loader専用クラスをbodyに付与
  document.body.classList.add("loader-page");

  const alreadyShown = sessionStorage.getItem("loaderShown") === "true";

  if (alreadyShown) {
    // セッション内で既に表示済み → loaderを即非表示
    loader.classList.add("is-hidden");
    document.body.classList.add("loader-active");

    document.getElementById("about")?.classList.add("is-show");

    return;
  }

  // 初回アクセス → 1秒後にフェードアウト
  document.body.classList.add("loader-active");
  document.body.classList.add("first-access");

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("is-hidden"); // フェードアウト
      document.getElementById("about")?.classList.add("is-show");
      sessionStorage.setItem("loaderShown", "true");
    }, 500);
  });
};
