---
title: "Figma로 디자인 시스템 구축하기"
excerpt: "컴포넌트 기반 디자인 시스템을 Figma로 구축하는 방법을 알아봅니다. 토큰 정의부터 컴포넌트 구성, 개발자 핸드오프까지 실무에서 바로 쓸 수 있는 내용을 정리합니다."
coverImage: "/assets/blog/hello-world/cover.jpg"
date: "2024-10-10T09:00:00.000Z"
author:
  name: JJ Kasper
  picture: "/assets/blog/authors/jj.jpeg"
ogImage:
  url: "/assets/blog/hello-world/cover.jpg"
category: "Design"
---

디자인 시스템은 일관된 사용자 경험을 만드는 단일 진실의 원천(single source of truth)입니다. Figma를 활용해 확장 가능한 디자인 시스템을 구축하는 방법을 살펴봅니다.

## 디자인 토큰부터 시작하기

디자인 토큰은 색상, 간격, 타이포그래피 등 디자인 결정을 변수로 저장한 것입니다.

**색상 토큰 계층 구조:**

```
Primitive (원시값)
├── Blue/100: #EFF6FF
├── Blue/500: #3B82F6
└── Blue/900: #1E3A8A

Semantic (의미 기반)
├── Color/Primary: {Blue/500}
├── Color/Primary/Hover: {Blue/600}
└── Color/Text/Default: {Gray/900}

Component (컴포넌트 전용)
├── Button/Background/Primary: {Color/Primary}
└── Button/Text/Primary: {Color/White}
```

**간격 토큰:**

```
Spacing/1:  4px
Spacing/2:  8px
Spacing/3:  12px
Spacing/4:  16px
Spacing/6:  24px
Spacing/8:  32px
Spacing/12: 48px
Spacing/16: 64px
```

## Figma Variables 설정

Figma Variables로 토큰을 정의하면 라이트/다크 모드를 손쉽게 전환할 수 있습니다.

**Collection 구조:**
- **Primitives**: 원시 값 (직접 참조 금지)
- **Semantic**: 의미 기반 변수 (실제 사용)
- **Spacing**: 간격 변수

각 Semantic 변수는 Primitive 값을 참조하고, 다크 모드는 같은 변수 이름에 다른 값을 매핑합니다.

## 컴포넌트 구성 원칙

### 1. 단일 책임

각 컴포넌트는 하나의 역할만 담당합니다.

```
Button
├── Size: Small / Medium / Large
├── Variant: Primary / Secondary / Ghost / Danger
├── State: Default / Hover / Pressed / Disabled / Loading
└── Leading Icon: Boolean
    Trailing Icon: Boolean
```

### 2. Auto Layout 활용

Auto Layout으로 반응형 컴포넌트를 구성합니다.

- **방향**: Horizontal / Vertical
- **간격**: Spacing 토큰 사용
- **패딩**: Spacing 토큰 사용
- **크기 조정**: Fixed / Hug Contents / Fill Container

### 3. Boolean 프로퍼티로 요소 토글

```
Card
├── Show Image: Boolean (기본 true)
├── Show Badge: Boolean (기본 false)
└── Show Footer: Boolean (기본 true)
```

## 컴포넌트 문서화

각 컴포넌트에는 다음을 포함합니다:

- **사용 지침**: 언제, 어디서 사용하는가
- **사용하지 말아야 할 경우**: 잘못된 사용 예시
- **접근성 고려사항**: 색상 대비, ARIA 레이블

## 개발자 핸드오프

디자이너와 개발자의 협업을 위한 체크리스트:

- [ ] 모든 색상이 Variables로 정의되어 있는가?
- [ ] 간격이 Spacing 토큰을 사용하는가?
- [ ] 컴포넌트 이름이 코드와 일치하는가?
- [ ] 모든 상태(hover, focus, disabled)가 디자인되어 있는가?
- [ ] 모바일/태블릿/데스크톱 반응형이 정의되어 있는가?
- [ ] 다크 모드 변형이 준비되어 있는가?

## 마치며

디자인 시스템은 한 번 만들고 끝나는 게 아니라 팀과 함께 지속적으로 발전시켜야 합니다. 처음부터 완벽하게 만들려 하기보다, 자주 사용하는 컴포넌트부터 시작해 점진적으로 확장해 나가는 것이 현실적입니다.
