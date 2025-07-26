import { cn } from '@/lib/utils';
import React from 'react';

export type Heading = {
    index: number;
    ref: Element;
    kind: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    id?: string;
    level: number;
    label: string;
    active: boolean;
    children: Heading[];
};

interface TableOfContentsProps {
    toc: Heading[];
    className?: string;
    isChild?: boolean;
}

const handleClick = (id?: string) => {
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;

    // 헤더 보정이 필요하면 여기에 보정값
    const yOffset = -80; // 고정 헤더 높이만큼 보정
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

    el.scrollIntoView({
        behavior: 'smooth',
    });

    console.log("🧭 스크롤 대상:", id, el, y);

    // URL hash 갱신
    history.pushState(null, '', `#${id}`);
};

export function TableOfContents({ toc, className, isChild = false }: TableOfContentsProps) {
    return (
        <ul className={cn('m-0 list-none text-sm', { 'pl-3': isChild })}>
            {toc.map((heading, i) => (
                <React.Fragment key={i}>
                    <li
                        className={cn('mt-0 py-1 text-muted-foreground transition-all cursor-pointer', {
                            'text-foreground font-medium': heading.active,
                            'text-xs': heading.level >= 3,
                            'font-medium': heading.level <= 2
                        })}
                    >
                        {heading.id ? (
                            <a
                                className="hover:text-foreground block"
                                onClick={() => handleClick(heading.id)}
                            >
                                {heading.label}
                            </a>
                        ) : (
                            heading.label
                        )}
                    </li>
                    {heading.children.length > 0 && (
                        <TableOfContents className={className} toc={heading.children} isChild={true} />
                    )}
                </React.Fragment>
            ))}
        </ul>
    );
};
