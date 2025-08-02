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
    // 새로운 객체를 생성하여 children 배열이 제대로 유지되도록 함
    const newHeading = {
      ...heading,
      children: []
    };

    while (stack.length > 0 && stack[stack.length - 1].level >= newHeading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(newHeading);
    } else {
      stack[stack.length - 1].children.push(newHeading);
    }

    stack.push(newHeading);
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

    // MDX 콘텐츠가 없으면 잠시 후 다시 시도
    if (flat.length <= 1) {
      const timeout = setTimeout(() => {
        const retryFlat = Array.from(ref.current!.querySelectorAll("h1, h2, h3, h4, h5, h6")).map(
          (el, i) => createHeading(el as HTMLHeadingElement, i)
        );
        
        flatRef.current = retryFlat;
        const tree = buildTocTree(retryFlat);
        setToc(tree);
      }, 500);
      
      return () => clearTimeout(timeout);
    }

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
          
          // 원본 flat 배열을 수정하지 않고 새로운 배열 생성
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