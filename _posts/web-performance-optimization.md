---
title: "웹 성능 최적화: Core Web Vitals 개선하기"
excerpt: "LCP, INP, CLS 등 Core Web Vitals 지표를 이해하고 실제로 개선하는 방법을 알아봅니다. 이미지 최적화, 코드 스플리팅, 폰트 로딩 전략까지 다룹니다."
coverImage: "/assets/blog/hello-world/cover.jpg"
date: "2024-12-05T09:00:00.000Z"
author:
  name: JJ Kasper
  picture: "/assets/blog/authors/jj.jpeg"
ogImage:
  url: "/assets/blog/hello-world/cover.jpg"
category: "Web"
---

Google의 Core Web Vitals는 사용자 경험을 측정하는 핵심 지표입니다. SEO에도 직접적인 영향을 주므로 개발자라면 반드시 알아야 합니다.

## Core Web Vitals 세 가지 지표

### LCP (Largest Contentful Paint)

페이지에서 가장 큰 콘텐츠 요소가 렌더링되는 시간입니다.

- **좋음**: 2.5초 이하
- **개선 필요**: 2.5 ~ 4.0초
- **나쁨**: 4.0초 초과

주요 원인: 느린 서버, 렌더링 블로킹 리소스, 느린 이미지 로딩

### INP (Interaction to Next Paint)

사용자 상호작용에 대한 응답성입니다. FID를 대체했습니다.

- **좋음**: 200ms 이하
- **개선 필요**: 200 ~ 500ms
- **나쁨**: 500ms 초과

### CLS (Cumulative Layout Shift)

페이지 로드 중 레이아웃이 얼마나 이동하는지 측정합니다.

- **좋음**: 0.1 이하
- **개선 필요**: 0.1 ~ 0.25
- **나쁨**: 0.25 초과

## LCP 개선: 이미지 최적화

```html
<!-- 히어로 이미지에 preload 적용 -->
<link rel="preload" as="image" href="/hero.webp" />

<!-- fetchpriority로 우선순위 지정 -->
<img src="/hero.webp" fetchpriority="high" alt="히어로" />

<!-- 화면 밖 이미지는 lazy loading -->
<img src="/below-fold.jpg" loading="lazy" alt="..." />
```

Next.js에서는 `<Image>` 컴포넌트가 이를 자동으로 처리합니다.

```tsx
import Image from "next/image";

// LCP 이미지
<Image src="/hero.jpg" alt="히어로" priority width={1200} height={600} />

// 일반 이미지 (자동 lazy loading)
<Image src="/card.jpg" alt="카드" width={400} height={300} />
```

## LCP 개선: 폰트 로딩

```html
<!-- preconnect로 폰트 서버 미리 연결 -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- font-display: swap으로 FOIT 방지 -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" rel="stylesheet" />
```

Next.js에서는 `next/font`를 사용하면 더 간단합니다.

```tsx
import { Noto_Sans_KR } from "next/font/google";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
```

## CLS 개선

```css
/* 이미지/비디오에 항상 크기 명시 */
img, video {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}

/* 동적으로 삽입되는 광고/배너 공간 예약 */
.ad-container {
  min-height: 250px;
}
```

## INP 개선: 무거운 작업 분산

```javascript
// setTimeout으로 메인 스레드 양보
function processLargeData(items) {
  const CHUNK_SIZE = 100;
  let index = 0;

  function processChunk() {
    const end = Math.min(index + CHUNK_SIZE, items.length);
    for (; index < end; index++) {
      process(items[index]);
    }
    if (index < items.length) {
      setTimeout(processChunk, 0); // 메인 스레드 양보
    }
  }

  processChunk();
}
```

## 성능 측정 도구

- **Lighthouse**: Chrome DevTools 내장, 종합 점수
- **PageSpeed Insights**: 실제 사용자 데이터(CrUX) 포함
- **Web Vitals 라이브러리**: 실시간 측정

```javascript
import { onLCP, onINP, onCLS } from "web-vitals";

onLCP(metric => console.log("LCP:", metric.value));
onINP(metric => console.log("INP:", metric.value));
onCLS(metric => console.log("CLS:", metric.value));
```

## 마치며

성능 최적화는 한 번에 모든 것을 고치려 하기보다, 측정 → 병목 파악 → 개선의 사이클을 반복하는 것이 효과적입니다. Lighthouse로 현재 상태를 파악하고 가장 영향이 큰 항목부터 시작하세요.
