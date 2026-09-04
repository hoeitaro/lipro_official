const contents = document.querySelector(".l-contents");
// const header = document.querySelector(".l-header");
// const drawer = document.querySelector(".p-drawer");

export const lock = (): void => {
  // if (!contents || !header || !drawer) return;
  if (!contents) return;
  contents.classList.add("is-scrollLock");
  // header.classList.add("is-scrollLock");
  // drawer.classList.add("is-scrollLock");
};

export const unLock = (): void => {
  // if (!contents || !header || !drawer) return;
  if (!contents) return;
  contents.classList.remove("is-scrollLock");
  // header.classList.remove("is-scrollLock");
  // drawer.classList.remove("is-scrollLock");
};
