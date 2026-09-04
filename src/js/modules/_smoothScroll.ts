export const initializeSmoothScroll = (): void => {
  document.addEventListener("click", handleClick, { capture: true });
};

// const getHeaderBlockSize = (): string => {
//   const header = document.querySelector("[data-fixed-header]") as HTMLElement;
//   if (!header) return "0";

//   const { position, blockSize } = window.getComputedStyle(header);
//   const isFixed = position === "fixed" || position === "sticky";

//   return isFixed ? blockSize : "0";
// };

const scrollToTarget = (element: HTMLElement): void => {
  // const headerBlockSize = getHeaderBlockSize();
  // element.style.scrollMarginBlockStart = headerBlockSize;

  const isPrefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const scrollBehavior = isPrefersReduced ? "instant" : "smooth";

  element.scrollIntoView({ behavior: scrollBehavior, inline: "end" });
  element.style.scrollMarginBlockStart = "";
};

const focusTarget = (element: HTMLElement): void => {
  element.focus({ preventScroll: true });

  if (document.activeElement !== element) {
    element.setAttribute("tabindex", "-1");
    element.focus({ preventScroll: true });
  }
};

const handleClick = (event: MouseEvent): void => {
  if (event.button !== 0) return;

  const currentLink = (event.target as HTMLElement).closest<HTMLAnchorElement>(
    'a[href*="#"]',
  );
  if (!currentLink) return;

  const hash = currentLink.hash;

  if (
    !hash ||
    currentLink.getAttribute("role") === "tab" ||
    currentLink.getAttribute("role") === "button" ||
    currentLink.getAttribute("data-smooth-scroll") === "disabled"
  )
    return;

  const target =
    document.getElementById(decodeURIComponent(hash.slice(1))) ||
    (hash === "#top" && document.body);

  if (target) {
    event.preventDefault();
    scrollToTarget(target);
    focusTarget(target);
    if (!(hash === "#top")) {
      history.pushState({}, "", hash);
    } else {
      history.pushState({}, "", window.location.pathname);
    }
  }
};

/* ======================================================
// initializePopoverMenu.ts
// ------------------------------------------------------ */

// const initializePopoverMenu = (popoverElement: HTMLElement): void => {
//   const anchorLinks = popoverElement.querySelectorAll("a");

//   if (anchorLinks.length > 0) {
//     anchorLinks.forEach((link) => {
//       link.addEventListener("click", (event) => handleHashlinkClick(event, popoverElement), false);
//       link.addEventListener("blur", (event) => handleFocusableElementsBlur(event, popoverElement), false);
//     });
//   }

//   popoverElement.addEventListener("click", (event) => handleBackdropClick(event, popoverElement), false);
// };

// const handleHashlinkClick = (event: MouseEvent, popover: HTMLElement): void => {
//   popover.hidePopover();
// };

// const handleFocusableElementsBlur = (event: Event, popover: HTMLElement): void => {
//   const target = (event as FocusEvent).relatedTarget as HTMLElement;

//   if (!popover.contains(target)) {
//     popover.hidePopover();
//   }
// };

// const handleBackdropClick = (event: MouseEvent, popover: HTMLElement): void => {
//   if (event.target === popover) {
//     popover.hidePopover();
//   }
// };

/* ======================================================
// ヘッダーの高さを取得する
// ------------------------------------------------------ */

// const observeHeaderBlockSize = new ResizeObserver((entries) => {
//   const header = entries[0];

//   if (header.contentBoxSize) {
//     const { blockSize } = header.borderBoxSize[0];

//     document.documentElement.style.setProperty("--header-height", `${blockSize}px`);
//   }
// });

// document.addEventListener("DOMContentLoaded", () => {
//   initializeSmoothScroll();

//   const header = document.querySelector("header");

//   if (header) observeHeaderBlockSize.observe(header);

//   const drawer = document.getElementById("drawer") as HTMLElement;

//   if (drawer) initializePopoverMenu(drawer);
// });
