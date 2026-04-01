---
title: "Next.js App Router 완전 정복 가이드"
excerpt: "Next.js 13부터 도입된 App Router는 기존 Pages Router와는 다른 방식으로 라우팅을 처리합니다. Server Component, Streaming, Layouts 등 새로운 개념을 하나씩 살펴봅니다."
coverImage: "/assets/blog/dynamic-routing/cover.jpg"
date: "2025-03-20T09:00:00.000Z"
author:
  name: Tim Neutkens
  picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/blog/dynamic-routing/cover.jpg"
category: "Next.js"
---

Next.js 13에서 도입된 App Router는 React의 최신 기능을 최대한 활용할 수 있도록 설계된 새로운 라우팅 시스템입니다. 기존 Pages Router와 비교했을 때 어떤 점이 다르고, 어떻게 활용하면 좋은지 살펴봅니다.

## App Router란?

App Router는 `app/` 디렉토리를 기반으로 동작하는 파일 시스템 기반 라우팅입니다. 기존 `pages/` 디렉토리와 다르게 React Server Components를 기본으로 사용합니다.

```
app/
├── layout.tsx       # 루트 레이아웃
├── page.tsx         # 홈 페이지 (/)
├── about/
│   └── page.tsx     # /about
└── blog/
    ├── page.tsx     # /blog
    └── [slug]/
        └── page.tsx # /blog/:slug
```

## Server Components vs Client Components

App Router에서 모든 컴포넌트는 기본적으로 **Server Component**입니다. 브라우저 API나 React 훅이 필요한 경우에만 `"use client"` 지시어를 추가합니다.

```tsx
// Server Component (기본값)
async function BlogList() {
  const posts = await fetchPosts(); // 서버에서 직접 데이터 페칭
  return <ul>{posts.map(post => <li key={post.id}>{post.title}</li>)}</ul>;
}
```

```tsx
"use client";
// Client Component
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Layouts

레이아웃은 여러 페이지에서 공유되는 UI입니다. 중첩 레이아웃도 지원하여 복잡한 UI 구조를 깔끔하게 표현할 수 있습니다.

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <nav>네비게이션</nav>
        {children}
        <footer>푸터</footer>
      </body>
    </html>
  );
}
```

## 데이터 페칭

App Router에서는 `fetch` API를 확장하여 캐싱과 재검증을 지원합니다.

```tsx
// 기본 캐싱 (Static)
const data = await fetch("https://api.example.com/posts");

// 재검증 (ISR)
const data = await fetch("https://api.example.com/posts", {
  next: { revalidate: 3600 }, // 1시간마다 재검증
});

// 캐싱 없음 (Dynamic)
const data = await fetch("https://api.example.com/posts", {
  cache: "no-store",
});
```

## 마치며

App Router는 처음에는 낯설 수 있지만, 익숙해지면 훨씬 강력하고 유연한 개발 경험을 제공합니다. Server Component를 통한 성능 향상과 직관적인 레이아웃 시스템은 대규모 애플리케이션 개발에 특히 유리합니다.
