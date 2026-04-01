---
title: "CSS Grid 레이아웃 마스터하기"
excerpt: "CSS Grid는 2차원 레이아웃을 자유롭게 구성할 수 있는 강력한 도구입니다. 기본 개념부터 복잡한 레이아웃 구현까지 실용적인 예제로 정리합니다."
coverImage: "/assets/blog/preview/cover.jpg"
date: "2025-01-15T09:00:00.000Z"
author:
  name: Joe Haddad
  picture: "/assets/blog/authors/joe.jpeg"
ogImage:
  url: "/assets/blog/preview/cover.jpg"
category: "CSS"
---

CSS Grid는 웹 레이아웃의 패러다임을 바꾼 도구입니다. Flexbox가 1차원(행 또는 열)이라면, Grid는 행과 열을 동시에 제어하는 2차원 레이아웃 시스템입니다.

## 기본 개념

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* 3열: 1:2:1 비율 */
  grid-template-rows: auto 1fr auto;   /* 3행 */
  gap: 1rem;
}
```

### fr 단위

`fr`은 사용 가능한 공간을 분배하는 단위입니다.

```css
/* 3등분 */
grid-template-columns: 1fr 1fr 1fr;

/* repeat()으로 단축 */
grid-template-columns: repeat(3, 1fr);

/* 고정 + 가변 */
grid-template-columns: 250px 1fr;
```

## 아이템 배치

```css
.item {
  grid-column: 1 / 3;    /* 1번 선부터 3번 선까지 (2열 차지) */
  grid-row: 2 / 4;       /* 2번 선부터 4번 선까지 (2행 차지) */
}

/* span 키워드 */
.wide-item {
  grid-column: span 2;   /* 현재 위치에서 2열 차지 */
}
```

## grid-template-areas

시각적으로 레이아웃을 정의할 수 있어 가독성이 뛰어납니다.

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 60px 1fr 60px;
  min-height: 100vh;
}

header { grid-area: header; }
aside  { grid-area: sidebar; }
main   { grid-area: main; }
footer { grid-area: footer; }
```

## auto-fill vs auto-fit

반응형 그리드를 간단하게 만드는 핵심 패턴입니다.

```css
/* auto-fill: 가능한 많은 열 생성, 빈 열도 유지 */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* auto-fit: 빈 열을 접어 아이템이 늘어남 */
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

미디어 쿼리 없이 반응형 카드 그리드를 구현할 수 있습니다.

## 실전: 카드 그리드 레이아웃

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

/* 첫 번째 카드를 강조 (featured) */
.card-grid .featured {
  grid-column: span 2;
  grid-row: span 2;
}
```

## 실전: 잡지 스타일 레이아웃

```css
.magazine {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 150px;
  gap: 1rem;
}

.magazine .hero    { grid-column: span 4; grid-row: span 2; }
.magazine .side-1  { grid-column: span 2; }
.magazine .side-2  { grid-column: span 2; }
.magazine .wide    { grid-column: span 6; }
```

## Subgrid

자식 요소가 부모 그리드의 트랙을 직접 사용합니다.

```css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  grid-column: span 3;
  display: grid;
  grid-template-columns: subgrid; /* 부모의 3열 트랙 상속 */
}
```

## 마치며

CSS Grid는 처음에는 학습 곡선이 있지만, 익히고 나면 복잡한 레이아웃도 단 몇 줄로 구현할 수 있습니다. Flexbox와 함께 적절히 조합하는 것이 현대 CSS 레이아웃의 핵심입니다.
