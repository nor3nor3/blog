---
title: "Tailwind CSS v4 무엇이 달라졌나"
excerpt: "Tailwind CSS v4는 성능과 개발자 경험을 크게 개선했습니다. CSS-first 설정, Oxide 엔진, 새로운 유틸리티 클래스 등 핵심 변경 사항을 정리합니다."
coverImage: "/assets/blog/dynamic-routing/cover.jpg"
date: "2025-02-10T09:00:00.000Z"
author:
  name: Tim Neutkens
  picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/blog/dynamic-routing/cover.jpg"
category: "CSS"
---

Tailwind CSS v4가 정식 출시되었습니다. 이번 버전은 단순한 업데이트가 아니라 내부 엔진부터 설정 방식까지 전면적으로 재설계된 메이저 업데이트입니다.

## Oxide 엔진

v4의 가장 큰 변화는 새로운 고성능 엔진인 **Oxide**입니다. Rust로 작성되어 빌드 속도가 v3 대비 최대 5배 빨라졌습니다.

- **전체 빌드**: ~3.5배 빠름
- **증분 빌드**: ~8배 빠름

## CSS-first 설정

`tailwind.config.js` 파일이 더 이상 필요하지 않습니다. 이제 CSS 파일 안에서 직접 설정합니다.

```css
/* v3: tailwind.config.js */
/* v4: globals.css */
@import "tailwindcss";

@theme {
  --color-brand: #6366f1;
  --font-sans: "Pretendard", sans-serif;
  --breakpoint-3xl: 1920px;
}
```

## 자동 콘텐츠 감지

v3에서는 `content` 배열에 파일 경로를 명시해야 했지만, v4는 자동으로 프로젝트 파일을 스캔합니다.

```js
// v3 tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}

// v4: 설정 불필요 — 자동 감지!
```

## 새로운 유틸리티

### field-sizing

textarea가 내용에 맞게 자동으로 크기를 조절합니다.

```html
<textarea class="field-sizing-content"></textarea>
```

### color-scheme

```html
<html class="color-scheme-dark">
```

### CSS Grid의 subgrid

```html
<div class="grid grid-cols-4">
  <div class="col-span-3 grid grid-cols-subgrid">
    <!-- 부모 그리드 트랙을 상속 -->
  </div>
</div>
```

## @variant와 커스텀 variant

```css
@variant hocus (&:hover, &:focus);
```

```html
<button class="hocus:bg-blue-600">버튼</button>
```

## v3에서 마이그레이션

공식 업그레이드 도구를 사용하면 대부분 자동으로 처리됩니다.

```bash
npx @tailwindcss/upgrade
```

주요 breaking change:
- `bg-opacity-*`, `text-opacity-*` → `bg-black/50` 형태로 통합
- `shadow-sm` → `shadow-xs` (이름 변경)
- `ring` 기본값 3px → 1px

## 마치며

v4는 속도와 DX 모두 크게 향상되었습니다. 신규 프로젝트라면 바로 v4를 사용하고, 기존 프로젝트는 마이그레이션 도구를 활용해 업그레이드를 고려해 보세요.
