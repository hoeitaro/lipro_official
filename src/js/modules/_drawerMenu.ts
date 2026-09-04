// import { getHeaderBlockSize } from "./_getHeaderBlockSize";
import { lock, unLock } from "./_scrollLockToggle";

export const initDrawerMenu = (): void => {
  const menu = document.querySelector<HTMLElement>(".js-menu");
  const drawer = document.querySelector<HTMLElement>(".js-drawer");
  const header = document.querySelector<HTMLElement>(".js-header");
  const body = document.body;

  if (!menu || !drawer || !header) return;

  const drawerLinks = drawer.querySelectorAll<HTMLAnchorElement>(".p-drawer a");
  const headerLogo = document.querySelector(".l-header__logo a");
  const mediaQuery = window.matchMedia("(max-width: 1024px)");
  // let scrollPosition = 0;

  const openMenu = (): void => {
    // const headerBlockSize = getHeaderBlockSize();
    // drawer.style.setProperty("--_header-block-size", headerBlockSize);
    // scrollPosition = window.scrollY;
    menu.classList.add("is-open");
    drawer.classList.add("is-active");
    header.classList.add("is-active");
    body.classList.add("is-fixed");
    // body.style.top = `-${scrollPosition}px`;
    lock();
  };

  const closeMenu = (): void => {
    menu.classList.remove("is-open");
    drawer.classList.remove("is-active");
    header.classList.remove("is-active");
    body.classList.remove("is-fixed");
    unLock();

    // 固定解除後に元の位置に戻す
    // const scrollY = Math.abs(parseInt(body.style.top || "0", 10));
    // body.style.top = "";
    // window.scrollTo(0, scrollY);
  };

  const toggleMenu = (e: MouseEvent): void => {
    e.preventDefault();
    if (menu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // ドロワー開閉ボタン
  menu.addEventListener("click", toggleMenu);

  // Drawer内リンククリック時
  drawerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) {
        closeMenu();
        return;
      }

      // smoothscroll.ts の処理を壊さないように
      // ドロワー閉鎖だけを先に行う
      closeMenu();

      // const target = document.querySelector<HTMLElement>(href);
      // if (target) {
      //   target.scrollIntoView({ behavior: "smooth" });
      // }
    });
  });

  // headerLogo!.addEventListener("click", () => {
  //   if (drawer.classList.contains("is-active")) {
  //     closeMenu();

  //     window.scroll({
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //   }
  // });
  headerLogo!.addEventListener("click", () => {
    if (drawer.classList.contains("is-active")) {
      closeMenu();
    }
  });

  mediaQuery.addEventListener("change", () => {
    if (menu.classList.contains("is-open")) closeMenu();
  });
};
