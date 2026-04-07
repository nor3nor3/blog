---
title: "Claude와 블로그 만들기"
excerpt: "Next.js 16, Tailwind CSS v4, React 19로 블로그를 처음부터 다시 설계한 과정. 패키지 업데이트부터 Bauhaus 미니멀리즘 디자인, 다크모드, 히어로 애니메이션, Giscus 댓글까지."
coverImage: "/assets/blog/dynamic-routing/cover.jpg"
date: "2026-04-02T00:00:00.000Z"
author:
  name: Alec Decoud
  picture: "/assets/blog/authors/jj.jpeg"
ogImage:
  url: "/assets/blog/dynamic-routing/cover.jpg"
category: "개발일지"
---

오늘은 Claude와 함께 이 블로그를 처음부터 다시 만들었다. 기존 Next.js 블로그 스타터에서 출발해서 디자인, 패키지, 기능을 전부 갈아엎었다. 작업 과정을 기록해둔다.

## 기술 스택 업그레이드

가장 먼저 한 일은 패키지를 최신 버전으로 올리는 것이었다.

- **Next.js** → 16
- **React** → 19 stable
- **Tailwind CSS** → v4 (PostCSS 플러그인 방식으로 변경)
- **TypeScript** → 6.0

Tailwind v4는 설정 방식이 완전히 바뀌었다. `tailwind.config.ts`가 사라지고 `globals.css` 안에서 `@theme`으로 토큰을 정의한다. `@tailwindcss/postcss` 플러그인 하나로 전부 처리된다.

```css
@import "tailwindcss";

@theme {
  --color-primary: var(--color-orange-500);
  --font-family-sans: "Pretendard Variable", ui-sans-serif, ...;
}
```

React 19도 타입이 더 엄격해졌다. `memo(() => ...)` 패턴이 타입 추론에 실패해서 일반 함수 선언으로 바꿔야 했다.

## 디자인 컨셉: Bauhaus 미니멀리즘

디자인 레퍼런스는 [Drams](https://drams.framer.website/)였다. Dieter Rams의 철학을 반영한 군더더기 없는 UI다. 색상은 stone(taupe) 계열 회색조에 orange-500을 포인트로 사용했다. Pretendard 폰트와 잘 어울린다.

## 다크모드

클래스 기반 다크모드를 직접 구현했다. `html.dark` 클래스로 제어하고, FOUC(Flash of Unstyled Content)를 막기 위해 인라인 스크립트를 `<head>`에 주입한다.

```css
@custom-variant dark (&:where(.dark, .dark *));
```

CSS Module에서 Tailwind 유틸리티를 쓰려면 `@reference "tailwindcss"`가 필요하다. 파일 경로가 아니라 패키지 이름을 그대로 쓰는 게 포인트.

## 토글 버튼

다크모드 토글은 Drams의 #039 컴포넌트에서 영감을 받아 만들었다. 작은 원형 버튼 하나인데, 라이트 모드에서는 amber 배경에 SVG로 그린 햇살 8개가 사방으로 뻗어있고, 다크모드에서는 달처럼 inset shadow로 표현된다. CSS `transition: all 0.3s`로 전환이 부드럽다.

```tsx
<svg width="45" height="45" viewBox="0 0 60 60">
  <line x1="30" y1="13" x2="30" y2="7" strokeWidth="1.5" strokeLinecap="round" />
  {/* 8방향 햇살 */}
</svg>
```

## 인덱스 페이지: 히어로 섹션

인덱스 페이지는 포스트 하나가 전체 화면을 채우는 구조다. 커버 이미지 위에 `mix-blend-difference`로 제목 텍스트를 올렸다. 이미지와 텍스트가 합성되는 방식이 재밌다.

페이지 진입 시 글자가 하나씩 나타나는 애니메이션을 넣었다. 단어 단위로 끊어서 3단어마다 줄바꿈도 된다.

```css
@keyframes hero-char-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@layer components {
  .hero-char {
    display: inline-block;
    opacity: 0;
    animation: hero-char-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
}
```

각 글자마다 `animationDelay`를 0.04s씩 늘려서 stagger 효과를 준다. Tailwind v4에서 커스텀 클래스는 `@layer components`에 넣어야 제대로 적용된다.

## 헤어라인 스크롤바

스크롤바를 가능한 한 얇게 만들었다. Firefox는 `scrollbar-width: thin`으로, Chrome/Safari는 webkit 속성으로 각각 처리했다.

```css
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-orange-500) var(--color-stone-800);
}

::-webkit-scrollbar { width: 1px; height: 1px; }
::-webkit-scrollbar-track { background: var(--color-stone-800); }
::-webkit-scrollbar-thumb { background: var(--color-orange-500); }
```

## RSS 피드와 사이트맵

`/feed.xml`과 `/sitemap.xml`도 추가했다. Next.js App Router에서 RSS는 `route.ts`로 만들고 `application/xml` Content-Type을 직접 반환한다. 사이트맵은 `sitemap.ts`를 export하면 Next.js가 자동으로 처리해준다.

## 댓글: Giscus

댓글 시스템은 [Giscus](https://giscus.app)를 선택했다. Utterances(GitHub Issues 기반)와 비교했을 때 Giscus(GitHub Discussions 기반)가 더 낫다고 판단했다.

- Issues는 버그/기능요청 용도라 댓글 저장소로 맞지 않음
- Discussions는 스레드형 답글과 리액션을 지원
- 다크모드 테마 연동이 깔끔함

다크모드 전환 시 giscus iframe에 `postMessage`로 테마를 동기화한다. `MutationObserver`로 `html.dark` 클래스 변화를 감지하는 방식이다.

```tsx
const observer = new MutationObserver(() => {
  const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: getTheme() } } },
    "https://giscus.app"
  );
});
observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["class"],
});
```

## 마무리

Claude에게 디자인 방향을 말하고, 코드를 받아보고, 피드백하는 과정을 반복했다. 대부분은 한 번에 원하는 결과가 나왔고, 안 나오면 "이렇게 바꿔줘"라고 하면 됐다. Tailwind v4 마이그레이션처럼 문서 없이는 시간이 걸렸을 작업도 빠르게 처리됐다.

앞으로도 뭔가 만들고 나면 이렇게 포스트로 기록할 예정이다.
