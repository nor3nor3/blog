---
title: "Turborepo로 모노레포 구성하기"
excerpt: "모노레포의 장단점과 Turborepo를 활용한 실전 구성 방법을 알아봅니다. 공유 패키지, 빌드 캐싱, 파이프라인 설정까지 단계별로 살펴봅니다."
coverImage: "/assets/blog/dynamic-routing/cover.jpg"
date: "2024-10-30T09:00:00.000Z"
author:
  name: Tim Neutkens
  picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/blog/dynamic-routing/cover.jpg"
category: "Dev"
---

여러 앱과 패키지를 하나의 저장소에서 관리하는 모노레포는 대규모 프로젝트에서 강력한 도구입니다. Turborepo를 활용하면 빌드 성능까지 챙길 수 있습니다.

## 모노레포의 장단점

**장점:**
- 코드 공유가 쉬움 (공통 컴포넌트, 유틸리티, 타입)
- 원자적 커밋 (여러 패키지를 한 번에 변경)
- 일관된 개발 환경 (ESLint, TypeScript 설정 공유)
- 의존성 중복 최소화

**단점:**
- CI/CD 설정 복잡도 증가
- 저장소 크기 증가
- 초기 설정 비용

## 프로젝트 구조

```
my-monorepo/
├── apps/
│   ├── web/          # Next.js 메인 앱
│   ├── admin/        # Next.js 어드민
│   └── mobile/       # React Native (선택)
├── packages/
│   ├── ui/           # 공유 UI 컴포넌트
│   ├── config/       # ESLint, TypeScript 설정
│   └── utils/        # 공통 유틸리티 함수
├── turbo.json
└── package.json
```

## 초기 설정

```bash
npx create-turbo@latest my-monorepo
cd my-monorepo
```

### package.json (루트)

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

## turbo.json 파이프라인 설정

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

`"^build"`는 "의존하는 패키지를 먼저 빌드"를 의미합니다.

## 공유 UI 패키지 만들기

```tsx
// packages/ui/src/button.tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button
      className={variant === "primary" ? "btn-primary" : "btn-secondary"}
      {...props}
    >
      {children}
    </button>
  );
}
```

```json
// packages/ui/package.json
{
  "name": "@my-org/ui",
  "exports": {
    "./button": "./src/button.tsx"
  }
}
```

앱에서 사용:

```tsx
// apps/web/src/app/page.tsx
import { Button } from "@my-org/ui/button";
```

## 빌드 캐싱

Turborepo의 핵심 기능은 **원격 캐싱**입니다. 한 번 빌드한 결과를 팀원이나 CI에서 재사용합니다.

```bash
# Vercel 원격 캐시 연결
npx turbo login
npx turbo link
```

이후 CI에서 이미 빌드된 패키지는 캐시에서 즉시 복원됩니다.

## 마치며

모노레포는 팀이 성장하고 공유 코드가 늘어날수록 빛을 발합니다. 처음부터 모노레포를 선택할 필요는 없지만, 공통 패키지가 생기기 시작한다면 Turborepo 도입을 진지하게 고려해 보세요.
