import { initLoader } from "./modules/_loader";

import PageLoaded from "./modules/_pageLoaded";

import { initializeObserveAnimation } from "./modules/_initializeObserveAnimation";

import { initializeSplitText } from "./modules/_splitText";

import { initScrollToggle } from "./modules/_initializeScrollToggle";

import { initClickableParentLink } from "./modules/_clickableParentLink";

import { initDrawerMenu } from "./modules/_drawerMenu";

import { initializeSmoothScroll } from "./modules/_smoothScroll";

import { observeHeaderBlockSize } from "./modules/_getHeaderBlockSize";

import SsgFormConfirmation from "./modules/_confirmation";

import "../scss/top.scss";

document.addEventListener("DOMContentLoaded", () => {
  /** -------------------------------
   * UI 初期化
   * ------------------------------- */
  initLoader();
  /* eslint-disable */
  new PageLoaded();
  /* eslint-enable */
  initScrollToggle();
  initClickableParentLink({
    parentSelector: ".p-bottom-link-item",
  });
  initDrawerMenu();
  initializeSmoothScroll();

  /* eslint-disable */
  new SsgFormConfirmation();
  /* eslint-enable */

  /** -------------------------------
   * header サイズ監視
   * ------------------------------- */
  const header = document.querySelector("header");
  if (header) observeHeaderBlockSize.observe(header);

  /** -------------------------------
   * アニメーション初期化
   * ------------------------------- */
  const targets = document.querySelectorAll<HTMLElement>("[data-animation]");
  if (targets.length > 0) {
    initializeObserveAnimation(Array.from(targets));
  }

  const splitTargets = document.querySelectorAll<HTMLElement>(
    "[data-animation='split-text']",
  );
  if (splitTargets.length > 0) {
    splitTargets.forEach((target) => {
      initializeSplitText(target, {
        characterClass: "character",
        alternativeClass: "visually-hidden",
        indexVariable: "index",
      });
    });
  }
});
