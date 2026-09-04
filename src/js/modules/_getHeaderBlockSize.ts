export const observeHeaderBlockSize = new ResizeObserver((entries) => {
  const header = entries[0];

  if (header.contentBoxSize) {
    const { blockSize } = header.borderBoxSize[0];

    document.documentElement.style.setProperty(
      "--_header-block-size",
      `${blockSize}px`,
    );
  }
});
