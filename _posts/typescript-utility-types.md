---
title: "TypeScript 유틸리티 타입 완벽 정리"
excerpt: "Partial, Required, Pick, Omit, Record 등 TypeScript에서 제공하는 내장 유틸리티 타입을 실용적인 예제와 함께 정리합니다. 타입 코드를 더 간결하게 작성하는 방법을 알아봅니다."
coverImage: "/assets/blog/hello-world/cover.jpg"
date: "2025-03-10T09:00:00.000Z"
author:
  name: JJ Kasper
  picture: "/assets/blog/authors/jj.jpeg"
ogImage:
  url: "/assets/blog/hello-world/cover.jpg"
category: "TypeScript"
---

TypeScript는 타입 변환을 쉽게 할 수 있도록 다양한 유틸리티 타입을 내장하고 있습니다. 이 타입들을 잘 활용하면 반복적인 타입 정의를 줄이고 코드를 더 유연하게 만들 수 있습니다.

## Partial\<T>

모든 프로퍼티를 선택적으로 만듭니다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// 업데이트 시 일부 필드만 전달할 때 유용
function updateUser(id: number, data: Partial<User>) {
  // data.name만 전달해도 OK
}
```

## Required\<T>

모든 프로퍼티를 필수로 만듭니다. `Partial`의 반대입니다.

```typescript
interface Config {
  host?: string;
  port?: number;
  debug?: boolean;
}

// 설정이 완전히 채워진 후 사용할 때
function startServer(config: Required<Config>) {
  console.log(`${config.host}:${config.port}`);
}
```

## Pick\<T, K>

특정 프로퍼티만 선택합니다.

```typescript
interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

// 목록 페이지에서는 요약 정보만
type ArticlePreview = Pick<Article, "id" | "title" | "author" | "createdAt">;
```

## Omit\<T, K>

특정 프로퍼티를 제외합니다.

```typescript
// id는 서버가 생성하므로 생성 시에는 제외
type CreateArticleDto = Omit<Article, "id" | "createdAt" | "updatedAt">;
```

## Record\<K, V>

키-값 쌍의 객체 타입을 만듭니다.

```typescript
type Category = "tech" | "life" | "travel";

const postCounts: Record<Category, number> = {
  tech: 42,
  life: 15,
  travel: 8,
};
```

## ReturnType\<T>

함수의 반환 타입을 추출합니다.

```typescript
function getUser() {
  return { id: 1, name: "홍길동", role: "admin" };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string; role: string; }
```

## Awaited\<T>

Promise의 결과 타입을 추출합니다.

```typescript
async function fetchPost(id: number) {
  const res = await fetch(`/api/posts/${id}`);
  return res.json() as Promise<{ title: string; content: string }>;
}

type Post = Awaited<ReturnType<typeof fetchPost>>;
// { title: string; content: string }
```

## 마치며

유틸리티 타입을 조합하면 복잡한 타입도 간결하게 표현할 수 있습니다. `Omit<Partial<User>, "id">`처럼 중첩해서 사용하는 것도 가능하니 다양하게 실험해 보세요.
