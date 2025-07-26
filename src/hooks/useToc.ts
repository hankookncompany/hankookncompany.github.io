import { useEffect, useRef, useState } from "react";

export type HeadingKind = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type Heading = {
  index: number;
  ref: Element;
  kind: HeadingKind;
  id?: string;
  level: number;
  label: string;
  active: boolean;
  children: Heading[];
};

export const INDEX_ATTRIBUTE = "data-toc-index";

const createHeading = (element: HTMLHeadingElement, index: number): Heading => {
  const kind = element.tagName.toLowerCase() as HeadingKind;

  element.setAttribute(INDEX_ATTRIBUTE, index.toString());

  return {
    index,
    ref: element,
    kind,
    id: element.id,
    level: parseInt(kind[1]),
    label: element.innerText ?? "",
    active: false,
    children: [],
  };
};

const buildTocTree = (flat: Heading[]): Heading[] => {
  const root: Heading[] = [];
  const stack: Heading[] = [];

  for (const heading of flat) {
    heading.children = []; // ensure reset

    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(heading);
    } else {
      stack[stack.length - 1].children.push(heading);
    }

    stack.push(heading);
  }

  return root;
};

export const useToc = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [toc, setToc] = useState<Heading[]>([]);
  const flatRef = useRef<Heading[]>([]);

  // flat TOC 생성
  useEffect(() => {
    if (!ref.current) return;

    const flat = Array.from(ref.current.querySelectorAll("h1, h2, h3, h4, h5, h6")).map(
      (el, i) => createHeading(el as HTMLHeadingElement, i)
    );

    flatRef.current = flat;
    const tree = buildTocTree(flat);
    setToc(tree);
  }, [ref]);

  // active 감지
  useEffect(() => {
    const flat = flatRef.current;
    if (flat.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => ({
            index: Number(entry.target.getAttribute(INDEX_ATTRIBUTE)),
            top: (entry.target as HTMLElement).getBoundingClientRect().top,
          }))
          .sort((a, b) => a.top - b.top);

        if (visible.length > 0) {
          const topMost = visible[0];
          const updatedFlat = flat.map((h) => ({
            ...h,
            active: h.index === topMost.index,
          }));

          flatRef.current = updatedFlat;
          const updatedTree = buildTocTree(updatedFlat);
          setToc(updatedTree);
        }
      },
      {
        rootMargin: "0% 0px -65% 0px",
        threshold: 0.1,
      }
    );

    flat.forEach((heading) => {
      observer.observe(heading.ref);
    });

    return () => observer.disconnect();
  }, []);

  return { ref, toc };
};