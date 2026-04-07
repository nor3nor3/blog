---
title: "블로그 개선"
excerpt: "풀스크린 오버레이 메뉴, backdrop-blur, ThemeSwitcher 3분리, 다크모드 CSS 변수 통일까지. 블로그 UI 두 번째 개편 기록."
coverImage: "/assets/blog/preview/cover.jpg"
date: "2026-04-02T00:00:00.000Z"
author:
  name: Alec Decoud
  picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/blog/preview/cover.jpg"
category: "개발일지"
---

지난 세션에서 블로그 껍데기를 만들었다면, 이번 세션은 그 껍데기를 다듬는 작업이었다. 햄버거 메뉴를 전면 재설계하고, ThemeSwitcher 코드를 분리하고, 다크모드 CSS 체계를 정리했다.

## 버그 먼저

작은 것들이 쌓여있었다.

- **본문 가독성**: 라이트모드 포스트 본문이 `text-stone-700`이라 연해보였다. `text-stone-900`으로 올렸다.
- **날짜 포맷**: `LLLL d, yyyy` (April 2, 2026) 형식이 한국 독자에게 어색했다. `yyyy.MM.dd`로 바꿨다.
- **포스트 카드 클릭 영역**: 제목 텍스트만 링크였는데, `<article>` 전체를 `<Link>`로 감쌌다. 어디를 눌러도 이동한다.
- **카테고리 미표시**: 포스트 페이지 상단에 카테고리가 안 나왔다. `PostHeader`에 `category` prop을 전달하지 않고 있었다.

## 햄버거 메뉴 재설계

기존 메뉴는 오른쪽에서 슬라이드인 되는 패널이었다. 답답했다. 풀스크린 오버레이로 바꿨다.

**열기/닫기 버튼**은 이모지를 썼다. 닫힌 상태는 🐵, 열린 상태는 🙈. 메뉴가 열리면 눈을 가리는 원숭이다. 기능과 상태가 직관적으로 전달된다.

**오버레이 배경**은 `backdrop-blur-[24px]`에 라이트모드 `bg-white/50`, 다크모드 `bg-black/50`. 뒤에 콘텐츠가 흐릿하게 비치면서 레이어감이 생긴다.

**메뉴 구성**은 레이아웃 자체가 정보다:

- 좌하단: ThemeToggle
- 우하단: 네비게이션 링크 (글자 스태거 애니메이션)
- 좌중단: RSS Feed (`-rotate-90`)
- 우중단: Sitemap (`rotate-90`)

RSS와 Sitemap을 90도 회전시켜서 세로로 읽히게 했다. 기능 링크인데 레이아웃 요소처럼 보인다.

닫기 트리거는 세 가지다: 닫기 버튼, Escape 키, 오버레이 빈 영역 클릭.

**스크롤바 폭 보상**도 처리했다. 메뉴가 열릴 때 `overflow: hidden`으로 스크롤바가 사라지면서 레이아웃이 흔들리는 문제다. `scrollbar-gutter: stable`을 `body`에 적용해서 스크롤바 영역을 항상 예약해뒀다.

## ThemeSwitcher 3분리

ThemeSwitcher가 하나의 파일에서 너무 많은 일을 하고 있었다. 세 개로 나눴다.

**`theme-script.ts`** — 공유 로직. 테마를 로컬스토리지에서 읽고 `html` 태그에 `dark` 클래스를 붙이거나 떼는 함수들이다. 클라이언트/서버 어디서든 import할 수 있다.

**`theme-inline-script.tsx`** — Server Component. `<head>` 안에 인라인 스크립트로 주입된다. `dangerouslySetInnerHTML`을 써야 하는데, Server Component에서 처리하면 "use client"가 필요 없다. FOUC(Flash of Unstyled Content)를 막는 역할이다.

**`theme-switcher.tsx`** — Client Component. ThemeToggle 버튼 자체. `useState`, `useEffect`, 클릭 이벤트가 필요하니 "use client"가 여기만 붙는다.

TypeScript 에러가 두 곳에서 났다. `declare global { interface Window { ... } }` 선언이 두 파일에서 충돌했고, `dangerouslySetInnerHTML`을 Server Component 바깥에서 쓰려 했다. 파일 분리로 둘 다 해소됐다.

## 히어로 섹션 수정

이전 구현에서 히어로 텍스트에 `mix-blend-difference`와 `grayscale`을 쓰고 있었다. 커버 이미지에 따라 텍스트가 너무 어둡거나 밝아지는 문제가 있었다. 제거하고 명시적인 색상으로 바꿨다: `text-stone-900 dark:text-stone-100`.

배경 이미지 위에 모드별 오버레이도 추가했다. 라이트 `bg-white/25`, 다크 `bg-black/25`. 이미지가 너무 날 것으로 드러나는 걸 살짝 가려준다.

## 다크모드 CSS 변수 정비

`globals.css`에 `.dark` 셀렉터로 하드코딩된 CSS가 있었다. Tailwind `dark:` 유틸리티와 혼재하면 우선순위 계산이 복잡해진다. 전부 지우고 Tailwind로만 처리하도록 통일했다.

`--color-primary` 변수는 라이트에서 `orange-500`, 다크에서 `orange-400`으로 분리했다. 어두운 배경에서는 500이 너무 진해서 400이 더 자연스럽다.

```css
@theme {
  --color-primary: var(--color-orange-500);
}

/* 컴포넌트에서는 */
/* text-orange-500 dark:text-orange-400 → text-primary */
```

전체 컴포넌트에서 `text-orange-500 dark:text-orange-400` 패턴을 `text-primary`로 통일했다. 나중에 포인트 컬러를 바꾸고 싶으면 `globals.css` 한 곳만 수정하면 된다.

## 세션 워크플로우 확립

이번 세션에서 Claude와 협업 방식도 정리했다. 세션 종료 시 작업 요약을 `last_session.md`에 저장하고, 다음 세션 시작 시 그 내용을 바탕으로 블로그 포스트를 올리는 흐름이다. 지금 읽고 있는 이 포스트가 그 방식으로 작성된 첫 번째 결과물이다.

AI가 쓴 포스트의 저자 이름은 **Alec Decoud**다. claudecode의 아나그램이다.
