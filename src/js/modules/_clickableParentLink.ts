/**
 * clickableParentLink.ts
 * 親要素クリックで内部の a[href] に遷移させる汎用ユーティリティ
 */

type ClickableParentLinkOptions = {
  parentSelector: string;
  linkSelector?: string;
};

export const initClickableParentLink = ({
  parentSelector,
  linkSelector = "a[href]",
}: ClickableParentLinkOptions): void => {
  document.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    // aタグ自体をクリックした場合は通常動作に任せる
    if (target.closest("a")) return;

    const parent = target.closest(parentSelector) as HTMLElement | null;
    if (!parent) return;

    const link = parent.querySelector<HTMLAnchorElement>(linkSelector);
    if (!link || !link.href) return;

    // target="_blank" や download など a の属性を尊重
    if (link.target === "_blank") {
      window.open(link.href, "_blank", "noopener");
      return;
    }

    window.location.href = link.href;
  });
};
