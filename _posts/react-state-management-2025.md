---
title: "2025년 React 상태 관리 라이브러리 비교"
excerpt: "Zustand, Jotai, TanStack Query, Recoil, Redux Toolkit 등 현재 주목받는 상태 관리 솔루션을 비교합니다. 각 라이브러리의 철학과 적합한 사용 사례를 정리합니다."
coverImage: "/assets/blog/preview/cover.jpg"
date: "2024-11-18T09:00:00.000Z"
author:
  name: Joe Haddad
  picture: "/assets/blog/authors/joe.jpeg"
ogImage:
  url: "/assets/blog/preview/cover.jpg"
category: "React"
---

React 생태계에서 상태 관리는 여전히 뜨거운 주제입니다. 2025년 현재 어떤 라이브러리들이 주목받고 있고, 어떤 상황에서 무엇을 선택해야 할지 정리합니다.

## 상태의 종류 먼저 이해하기

상태 관리 도구를 선택하기 전에 관리할 상태의 종류를 파악하는 것이 중요합니다.

| 종류 | 예시 | 적합한 도구 |
|------|------|-------------|
| 서버 상태 | API 데이터, 캐시 | TanStack Query, SWR |
| 전역 UI 상태 | 모달, 다크모드, 인증 | Zustand, Jotai |
| 폼 상태 | 입력값, 유효성 | React Hook Form |
| 지역 상태 | 드롭다운 열림/닫힘 | useState |

## TanStack Query (서버 상태)

서버 데이터 페칭, 캐싱, 동기화에 특화되었습니다.

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function PostList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetch("/api/posts").then(res => res.json()),
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터로 간주
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return <ul>{data.map(post => <PostItem key={post.id} post={post} />)}</ul>;
}

function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post) => fetch("/api/posts", { method: "POST", body: JSON.stringify(post) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
}
```

## Zustand (전역 UI 상태)

보일러플레이트가 거의 없고 직관적인 API를 제공합니다.

```tsx
import { create } from "zustand";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  login: async (credentials) => {
    set({ isLoading: true });
    const user = await authenticate(credentials);
    set({ user, isLoading: false });
  },
  logout: () => set({ user: null }),
}));

// 컴포넌트에서 사용 - 필요한 상태만 구독
const user = useAuthStore(state => state.user);
const login = useAuthStore(state => state.login);
```

## Jotai (원자적 상태)

Recoil에서 영감을 받은 원자(atom) 기반 상태 관리입니다.

```tsx
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const themeAtom = atom<"light" | "dark">("light");
const userAtom = atom<User | null>(null);

// 파생 atom
const isLoggedInAtom = atom(get => get(userAtom) !== null);

function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);
  return (
    <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
```

## 추천 조합

```
서버 상태: TanStack Query
전역 UI 상태: Zustand 또는 Jotai
폼 상태: React Hook Form + Zod
지역 상태: useState / useReducer
```

대부분의 프로젝트에서 이 조합이면 충분합니다. Redux는 이미 Redux Toolkit을 사용하는 팀에서만 유지하는 것을 권장합니다.

## 마치며

2025년의 트렌드는 "서버 상태와 클라이언트 상태를 분리하라"입니다. TanStack Query로 서버 상태를 처리하면, 전역으로 관리해야 할 클라이언트 상태는 생각보다 훨씬 줄어듭니다.
