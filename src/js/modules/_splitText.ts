type SplitTextOptions = {
  characterClass?: string;
  alternativeClass?: string;
  indexVariable?: string;
};

const defaultOptions: Required<SplitTextOptions> = {
  characterClass: "character",
  alternativeClass: "alternative",
  indexVariable: "index",
};

export function initializeSplitText(
  element: HTMLElement | null,
  options: SplitTextOptions = {},
): void {
  if (!element) {
    console.error("initializeSplitText: Element is not found.");
    return;
  }

  const mergedOptions = { ...defaultOptions, ...options };

  prepareVisuallyHidden(element, mergedOptions);
  splitText(element, mergedOptions);
}

function prepareVisuallyHidden(
  element: HTMLElement,
  options: Required<SplitTextOptions>,
): void {
  const text = element.textContent;
  if (!text) return;

  const span = document.createElement("span");
  span.textContent = text;
  if (options.alternativeClass) {
    span.classList.add(options.alternativeClass);
  }
  element.appendChild(span);
}

function splitText(
  element: HTMLElement,
  options: Required<SplitTextOptions>,
): void {
  const nodes: ChildNode[] = Array.from(element.childNodes);
  const fragment = document.createDocumentFragment();
  let characterIndex = 0;

  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      const characters = Array.from(text);

      characters.forEach((character) => {
        if (/\s/.test(character)) {
          const span = document.createElement("span");
          span.innerHTML = "&nbsp;";
          span.setAttribute("aria-hidden", "true");
          fragment.appendChild(span);
        } else {
          const span = document.createElement("span");
          span.textContent = character;
          if (options.characterClass) {
            span.classList.add(options.characterClass);
          }
          if (options.indexVariable) {
            span.style.setProperty(
              `--_${options.indexVariable}`,
              String(characterIndex),
            );
          }
          span.setAttribute("aria-hidden", "true");
          span.setAttribute("translate", "no");
          fragment.appendChild(span);
          characterIndex++;
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      fragment.appendChild(node.cloneNode(true));
    }
  });

  element.textContent = "";
  element.appendChild(fragment);
}
