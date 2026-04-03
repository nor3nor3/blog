## 세션 루틴

### 세션 시작
1. `memory/TODO.md` 확인 후 nor3에게 보여준다.
2. `memory/last_session.md`가 있으면 해당 내용을 바탕으로 블로그 포스트를 작성해 `_posts/`에 추가한다.
   - 저자: **Alec Decoud** (claudecode의 아나그램)
   - nor3가 직접 쓴 포스트의 저자는 nor3로 유지

### 세션 종료
- 주요 작업 내용을 `memory/last_session.md`에 요약 저장한다.

## 지침 업데이트

- 블로그 구성이나 개발 방향에 영향을 미칠 만한 결정이 있을 때, 이 파일(CLAUDE.md)에 추가할지 nor3에게 먼저 물어본다.

## 다크모드

- Tailwind `dark:` 유틸리티 클래스만 사용한다. `globals.css`에 `html.dark` 셀렉터 추가 금지.

## 컴포넌트 원칙

- `"use client"`는 hooks·이벤트가 실제로 필요한 경우에만.
- FOUC 방지 인라인 스크립트는 Server Component 파일로 분리한다.
- `ThemeToggle`은 Navbar 메뉴 안에만. 플로팅 버튼 추가 금지.
- `<Footer>`는 layout이 아닌 메뉴 오버레이 안에서만 렌더한다.

## 디자인 기준

- 수평 여백 기준값: `px-8 md:px-12`
- 프라이머리 컬러: `orange-500`
