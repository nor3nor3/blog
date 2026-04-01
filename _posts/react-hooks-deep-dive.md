---
title: "React Hooks 심층 탐구: useState부터 useTransition까지"
excerpt: "React의 기본 훅부터 최신 훅까지 동작 원리와 실전 활용법을 정리합니다. useReducer, useContext, useMemo, useCallback, useTransition의 올바른 사용 시점을 알아봅니다."
coverImage: "/assets/blog/preview/cover.jpg"
date: "2025-02-25T09:00:00.000Z"
author:
  name: Joe Haddad
  picture: "/assets/blog/authors/joe.jpeg"
ogImage:
  url: "/assets/blog/preview/cover.jpg"
category: "React"
---

React Hooks는 함수형 컴포넌트에서 상태와 사이드 이펙트를 관리할 수 있게 해주는 강력한 도구입니다. 기본 훅부터 최신 훅까지 차근차근 살펴보겠습니다.

## useState vs useReducer

`useState`는 단순한 상태에, `useReducer`는 복잡한 상태 로직에 적합합니다.

```tsx
// useState - 단순한 경우
const [count, setCount] = useState(0);

// useReducer - 여러 상태가 연관된 경우
type State = { count: number; step: number };
type Action = { type: "increment" } | { type: "setStep"; step: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step };
    case "setStep":
      return { ...state, step: action.step };
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });
```

## useCallback과 useMemo

불필요한 재연산과 재생성을 막는 메모이제이션 훅입니다.

```tsx
// useCallback - 함수 참조를 유지
const handleClick = useCallback(() => {
  console.log(id);
}, [id]); // id가 바뀔 때만 새 함수 생성

// useMemo - 계산값을 캐싱
const sortedItems = useMemo(
  () => items.slice().sort((a, b) => a.price - b.price),
  [items]
);
```

> **주의**: 모든 함수와 값에 적용하면 오히려 성능이 나빠집니다. 실제로 비용이 큰 연산이나 자식 컴포넌트에 전달하는 props에만 사용하세요.

## useRef

DOM 접근과 렌더링을 트리거하지 않는 값 저장에 사용합니다.

```tsx
// DOM 접근
const inputRef = useRef<HTMLInputElement>(null);
const focusInput = () => inputRef.current?.focus();

// 렌더링 없이 값 유지 (interval ID 등)
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

useEffect(() => {
  timerRef.current = setInterval(() => tick(), 1000);
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, []);
```

## useTransition

React 18의 동시성 기능을 활용해 UI를 블로킹하지 않고 상태를 업데이트합니다.

```tsx
const [isPending, startTransition] = useTransition();

function handleSearch(query: string) {
  setInputValue(query); // 즉시 반영 (긴급)

  startTransition(() => {
    setSearchResults(search(query)); // 지연 가능 (비긴급)
  });
}

return (
  <>
    <input value={inputValue} onChange={e => handleSearch(e.target.value)} />
    {isPending ? <Spinner /> : <Results data={searchResults} />}
  </>
);
```

## useDeferredValue

`useTransition`과 비슷하지만, 자신이 제어하지 않는 값에 사용합니다.

```tsx
function SearchResults({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery는 렌더링 우선순위가 낮아 UI 블로킹 없이 업데이트
  return <ExpensiveList filter={deferredQuery} />;
}
```

## 마치며

훅을 올바르게 사용하는 것은 React 앱의 성능과 유지보수성에 직결됩니다. 특히 `useCallback`과 `useMemo`는 "필요할 때만" 사용하는 것이 핵심입니다.
