const defaultOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px 0px -20% 0px",
  threshold: 0,
};

export const initializeObserveAnimation = (
  targets: HTMLElement[],
  options: IntersectionObserverInit = {},
): void => {
  if (targets.length === 0) {
    console.error("initializeObserveAnimation: Target elements are not found.");
    return;
  }

  const mergedOptions: IntersectionObserverInit = {
    ...defaultOptions,
    ...options,
  };

  const observer = createObserver(mergedOptions, targets.length);
  targets.forEach((target) => observer.observe(target));
};

const createObserver = (
  options: IntersectionObserverInit,
  targetsLength: number,
): IntersectionObserver => {
  let activeCount = 0;

  const handleObserve = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
  ): void => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.setAttribute("data-animated", "true");
        observer.unobserve(entry.target);
        activeCount++;
      }
    });

    if (activeCount === targetsLength) {
      observer.disconnect();
    }
  };

  return new IntersectionObserver(handleObserve, options);
};
