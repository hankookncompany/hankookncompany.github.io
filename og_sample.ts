import React from "react"
export const OG_TEMPLATES = {
  blog: {
    background: "#ffffff",
    accent: "#3b82f6",
    textColor: "#1f2937",
    subtextColor: "#6b7280",
    badgeColor: "#3b82f6",
  },
  product: {
    background: "#ffffff",
    accent: "#ec4899",
    textColor: "#1f2937",
    subtextColor: "#6b7280",
    badgeColor: "#ec4899",
  },
  home: {
    background: "#ffffff",
    accent: "#0ea5e9",
    textColor: "#1f2937",
    subtextColor: "#6b7280",
    badgeColor: "#0ea5e9",
  },
  author: {
    background: "#ffffff",
    accent: "#06b6d4",
    textColor: "#1f2937",
    subtextColor: "#6b7280",
    badgeColor: "#06b6d4",
  },
} as const

// md-badges 리포지토리를 참고한 정확한 shields.io 배지 매핑
const TECH_BADGES: Record<string, { color: string; logo: string; logoColor?: string }> = {
  // Programming Languages
  JavaScript: { color: "F7DF1E", logo: "javascript", logoColor: "000" },
  TypeScript: { color: "3178C6", logo: "typescript", logoColor: "fff" },
  Python: { color: "3776AB", logo: "python", logoColor: "fff" },
  Java: { color: "ED8B00", logo: "openjdk", logoColor: "white" },
  "C++": { color: "00599C", logo: "c%2B%2B", logoColor: "white" },
  "C#": { color: "239120", logo: "csharp", logoColor: "white" },
  Go: { color: "00ADD8", logo: "go", logoColor: "white" },
  Rust: { color: "000000", logo: "rust", logoColor: "white" },
  PHP: { color: "777BB4", logo: "php", logoColor: "white" },
  Ruby: { color: "CC342D", logo: "ruby", logoColor: "white" },
  Swift: { color: "F54A2A", logo: "swift", logoColor: "white" },
  Kotlin: { color: "7F52FF", logo: "kotlin", logoColor: "white" },
  Dart: { color: "0175C2", logo: "dart", logoColor: "white" },

  // Frontend Frameworks
  React: { color: "20232a", logo: "react", logoColor: "61DAFB" },
  "Next.js": { color: "black", logo: "next.js", logoColor: "white" },
  Vue: { color: "4FC08D", logo: "vuedotjs", logoColor: "fff" },
  "Vue.js": { color: "4FC08D", logo: "vuedotjs", logoColor: "fff" },
  Angular: { color: "DD0031", logo: "angular", logoColor: "white" },
  Svelte: { color: "f1413d", logo: "svelte", logoColor: "white" },
  SvelteKit: { color: "f1413d", logo: "svelte", logoColor: "white" },
  Nuxt: { color: "002E3B", logo: "nuxt", logoColor: "00DC82" },
  Gatsby: { color: "663399", logo: "gatsby", logoColor: "white" },
  Astro: { color: "BC52EE", logo: "astro", logoColor: "fff" },
  Remix: { color: "000", logo: "remix", logoColor: "fff" },
  Solid: { color: "2C4F7C", logo: "solid", logoColor: "fff" },

  // Backend Frameworks
  "Node.js": { color: "6DA55F", logo: "node.js", logoColor: "white" },
  Express: { color: "404d59", logo: "express", logoColor: "61DAFB" },
  "Express.js": { color: "404d59", logo: "express", logoColor: "61DAFB" },
  Fastify: { color: "000000", logo: "fastify", logoColor: "white" },
  NestJS: { color: "E0234E", logo: "nestjs", logoColor: "white" },
  Django: { color: "092E20", logo: "django", logoColor: "white" },
  Flask: { color: "000", logo: "flask", logoColor: "fff" },
  FastAPI: { color: "009485", logo: "fastapi", logoColor: "white" },
  Laravel: { color: "FF2D20", logo: "laravel", logoColor: "white" },
  "Spring Boot": { color: "6DB33F", logo: "springboot", logoColor: "fff" },

  // CSS Frameworks & Libraries
  "Tailwind CSS": { color: "38B2AC", logo: "tailwind-css", logoColor: "white" },
  Tailwind: { color: "38B2AC", logo: "tailwind-css", logoColor: "white" },
  Bootstrap: { color: "7952B3", logo: "bootstrap", logoColor: "fff" },
  "styled-components": { color: "DB7093", logo: "styledcomponents", logoColor: "fff" },
  Sass: { color: "CC6699", logo: "sass", logoColor: "fff" },
  Less: { color: "1D365D", logo: "less", logoColor: "fff" },
  "shadcn/ui": { color: "000", logo: "shadcnui", logoColor: "fff" },

  // Databases
  MongoDB: { color: "4ea94b", logo: "mongodb", logoColor: "white" },
  PostgreSQL: { color: "316192", logo: "postgresql", logoColor: "white" },
  MySQL: { color: "4479A1", logo: "mysql", logoColor: "fff" },
  Redis: { color: "DD0031", logo: "redis", logoColor: "white" },
  SQLite: { color: "07405e", logo: "sqlite", logoColor: "white" },
  Supabase: { color: "3FCF8E", logo: "supabase", logoColor: "fff" },
  Firebase: { color: "039BE5", logo: "Firebase", logoColor: "white" },

  // Cloud & DevOps
  AWS: { color: "FF9900", logo: "amazon-aws", logoColor: "white" },
  "Google Cloud": { color: "4285F4", logo: "google-cloud", logoColor: "white" },
  Azure: { color: "0089D6", logo: "microsoftazure", logoColor: "white" },
  Docker: { color: "2496ED", logo: "docker", logoColor: "fff" },
  Kubernetes: { color: "326CE5", logo: "kubernetes", logoColor: "fff" },
  Vercel: { color: "000000", logo: "vercel", logoColor: "white" },
  Netlify: { color: "000000", logo: "netlify", logoColor: "00C7B7" },
  Heroku: { color: "430098", logo: "heroku", logoColor: "fffe" },

  // Tools & Others
  Git: { color: "F05032", logo: "git", logoColor: "fff" },
  GitHub: { color: "121011", logo: "github", logoColor: "white" },
  GitLab: { color: "FC6D26", logo: "gitlab", logoColor: "fff" },
  Webpack: { color: "8DD6F9", logo: "webpack", logoColor: "black" },
  Vite: { color: "646CFF", logo: "vite", logoColor: "fff" },
  ESLint: { color: "4B32C3", logo: "eslint", logoColor: "fff" },
  Prettier: { color: "F7B93E", logo: "prettier", logoColor: "fff" },
  Jest: { color: "C21325", logo: "jest", logoColor: "fff" },
  Cypress: { color: "69D3A7", logo: "cypress", logoColor: "fff" },
  Playwright: { color: "2EAD33", logo: "playwright", logoColor: "fff" },

  // Mobile
  "React Native": { color: "20232a", logo: "react", logoColor: "61DAFB" },
  Flutter: { color: "02569B", logo: "flutter", logoColor: "fff" },
  Expo: { color: "000020", logo: "expo", logoColor: "fff" },

  // State Management
  Redux: { color: "764ABC", logo: "redux", logoColor: "fff" },
  MobX: { color: "FF9955", logo: "mobx", logoColor: "fff" },
  Zustand: { color: "000", logo: "zustand", logoColor: "fff" },

  // Testing
  Vitest: { color: "6E9F18", logo: "vitest", logoColor: "fff" },
  "Testing Library": { color: "E33332", logo: "testinglibrary", logoColor: "fff" },

  // Build Tools
  Rollup: { color: "EC4A3F", logo: "rollup.js", logoColor: "fff" },
  Parcel: { color: "21374B", logo: "parcel", logoColor: "fff" },
  Turbo: { color: "EF4444", logo: "turbo", logoColor: "fff" },

  // CMS & Headless
  Strapi: { color: "2E7EEA", logo: "strapi", logoColor: "white" },
  Contentful: { color: "2478CC", logo: "contentful", logoColor: "fff" },
  Sanity: { color: "F03E2F", logo: "sanity", logoColor: "fff" },

  // AI & ML
  TensorFlow: { color: "ff8f00", logo: "tensorflow", logoColor: "white" },
  PyTorch: { color: "ee4c2c", logo: "pytorch", logoColor: "white" },
  OpenAI: { color: "412991", logo: "openai", logoColor: "fff" },

  // 기타 자주 사용되는 것들
  Hooks: { color: "61DAFB", logo: "react", logoColor: "000" },
  Frontend: { color: "FF6B6B", logo: "html5", logoColor: "white" },
  Backend: { color: "4ECDC4", logo: "server", logoColor: "white" },
  "Full Stack": { color: "9B59B6", logo: "stackshare", logoColor: "white" },
  "E-commerce": { color: "FF9F43", logo: "shopify", logoColor: "white" },
  API: { color: "009688", logo: "api", logoColor: "white" },
  GraphQL: { color: "E10098", logo: "graphql", logoColor: "fff" },
  REST: { color: "02569B", logo: "rest", logoColor: "fff" },
  Microservices: { color: "326CE5", logo: "microservices", logoColor: "fff" },
}

// shields.io 배지 URL 생성 함수 (for-the-badge 스타일 사용)
function createShieldsBadgeUrl(tech: string): string {
  const badge = TECH_BADGES[tech]
  if (!badge) {
    // 기본 배지 스타일 (회색)
    return `https://img.shields.io/badge/${encodeURIComponent(tech)}-gray?style=for-the-badge`
  }

  const { color, logo, logoColor = "white" } = badge
  return `https://img.shields.io/badge/${encodeURIComponent(tech)}-${color}?style=for-the-badge&logo=${logo}&logoColor=${logoColor}`
}

function createSimpleOGImage(options: OGImageOptions) {
  const template = OG_TEMPLATES[options.type]
  const { title, subtitle, author, tags = [], locale, publishedDate, avatar } = options

  // Truncate title if too long
  const truncatedTitle = title.length > 50 ? title.substring(0, 47) + "..." : title
  const truncatedSubtitle = subtitle && subtitle.length > 120 ? subtitle.substring(0, 117) + "..." : subtitle

  // Show max 3 tags
  const displayTags = tags.slice(0, 3)

  const contentTypeBadgeText =
    options.type === "blog"
      ? locale === "ko"
        ? "블로그"
        : "Blog"
      : options.type === "product"
        ? locale === "ko"
          ? "프로젝트"
          : "Project"
        : options.type === "author"
          ? locale === "ko"
            ? "팀원"
            : "Team"
          : locale === "ko"
            ? "홈"
            : "Home"

  return React.createElement(
    "div",
    {
      style: {
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        background: template.background,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "80px",
        position: "relative",
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        border: "1px solid #e5e7eb",
      },
    },
    [
      // Brand badge (top right)
      React.createElement(
        "div",
        {
          key: "brand",
          style: {
            position: "absolute",
            top: "40px",
            right: "40px",
            background: template.accent,
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#ffffff",
          },
        },
        "Team Tech Blog",
      ),

      // Content type badge (top left)
      React.createElement(
        "div",
        {
          key: "type-badge",
          style: {
            background: "#f3f4f6",
            color: template.textColor,
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "500",
            marginBottom: "32px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          },
        },
        contentTypeBadgeText,
      ),

      // Main title
      React.createElement(
        "h1",
        {
          key: "title",
          style: {
            fontSize: "64px",
            fontWeight: "800",
            color: template.textColor,
            margin: "0 0 24px 0",
            lineHeight: "1.1",
            maxWidth: "900px",
          },
        },
        truncatedTitle,
      ),

      // Subtitle
      truncatedSubtitle
        ? React.createElement(
            "p",
            {
              key: "subtitle",
              style: {
                fontSize: "24px",
                color: template.subtextColor,
                margin: "0 0 40px 0",
                lineHeight: "1.4",
                maxWidth: "800px",
                fontWeight: "400",
              },
            },
            truncatedSubtitle,
          )
        : null,

      // Author info
      author
        ? React.createElement(
            "div",
            {
              key: "author",
              style: {
                display: "flex",
                alignItems: "center",
                fontSize: "20px",
                color: template.subtextColor,
                margin: "0 0 32px 0",
                fontWeight: "500",
              },
            },
            [
              React.createElement(
                "div",
                {
                  key: "avatar",
                  style: {
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: template.accent,
                    marginRight: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: "600",
                  },
                },
                avatar
                  ? React.createElement("img", {
                      src: avatar,
                      alt: author,
                      style: {
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      },
                    })
                  : author.charAt(0).toUpperCase(),
              ),
              `by ${author}`,
            ],
          )
        : null,

      // Tech stack badges using shields.io
      displayTags.length > 0
        ? React.createElement(
            "div",
            {
              key: "tags",
              style: {
                display: "flex",
                gap: "12px",
                margin: "0 0 40px 0",
                flexWrap: "wrap",
              },
            },
            displayTags.map((tag, index) => {
              return React.createElement("img", {
                key: `tag-${index}`,
                src: createShieldsBadgeUrl(tag),
                alt: tag,
                style: {
                  height: "28px",
                  borderRadius: "4px",
                },
              })
            }),
          )
        : null,

      // Date (bottom left)
      publishedDate
        ? React.createElement(
            "div",
            {
              key: "date",
              style: {
                position: "absolute",
                bottom: "40px",
                left: "80px",
                fontSize: "16px",
                color: template.subtextColor,
                fontWeight: "400",
              },
            },
            new Date(publishedDate).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          )
        : null,

      // Decorative accent line
      React.createElement("div", {
        key: "accent-line",
        style: {
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "100%",
          height: "8px",
          background: `linear-gradient(90deg, ${template.accent} 0%, ${template.accent}80 100%)`,
        },
      }),
    ].filter(Boolean),
  )
}

export interface OGImageOptions {
  title: string
  subtitle?: string
  author?: string
  tags?: string[]
  type: OGTemplateType
  locale: "ko" | "en"
  publishedDate?: string
  avatar?: string
}

export type OGTemplateType = keyof typeof OG_TEMPLATES

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
