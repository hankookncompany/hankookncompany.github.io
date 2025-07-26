'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <div className={cn(
      "flex-shrink-0 rounded-lg p-1.5", 
      "bg-foreground border border-border",
      className
    )}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 256 256" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-sm"
      >
        {/* 기본 블록들 - 배경색으로 표시 */}
        <path d="M26 26H86V86H26V26Z" fill="var(--background)"/>
        <rect x="26" y="98" width="60" height="60" fill="var(--background)"/>
        <path d="M26 170H86V230H26V170Z" fill="var(--background)"/>
        <rect x="98" y="170" width="60" height="60" fill="var(--background)"/>
        <path d="M170 98H230V170L170 230V98Z" fill="var(--background)"/>
        <rect x="98" y="26" width="60" height="60" fill="var(--background)"/>
        
        {/* 포인트 컬러 - 항상 파란색 유지 */}
        <path d="M170 26H242V98L170 26Z" fill="#106DEC"/>
      </svg>
    </div>
  );
}
