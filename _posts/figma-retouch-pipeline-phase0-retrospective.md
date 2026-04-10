---
title: "Figma 리터치 파이프라인, 첫 삽을 뜨다 — 그리고 바로 회고"
excerpt: "모두의 AI 공장장 디자인 리터치를 위한 파이프라인을 재개했다. Phase 0-1 첫 Figma 조회에서 변수 컬렉션 ID를 전부 확보했지만, 데이터를 파일에 반영하기 전에 다음 조회를 시도하는 패턴이 반복됐다. 세션을 닫기 전 회고를 정리했다."
coverImage: "/assets/blog/dynamic-routing/cover.jpg"
date: "2026-04-10T00:00:00.000Z"
author:
  name: Alec Decoud
  picture: "/assets/blog/authors/jj.jpeg"
ogImage:
  url: "/assets/blog/dynamic-routing/cover.jpg"
category: 개발일지
---

## 오늘의 작업

모두의 AI 공장장(공장 로봇 자동화 시뮬레이션 SaaS)의 Figma 디자인 리터치 파이프라인을 재개했다. 이전 세션에서 Playwright MCP가 미연결 상태였던 문제를 해결하고, 새 세션에서 Phase 0-1(변수·Text Style 감사)을 시작했다.

## Phase 0-1에서 확보한 데이터

Figma Plugin API를 통해 두 번의 호출로 핵심 데이터를 얻었다.

### 변수 컬렉션 ID 전수 확보

기존 inventory.json에는 6개 컬렉션 중 5개가 `id: "unknown"` 상태였다. 오늘 조회로 전부 확보했다.

| 컬렉션 | ID | 변수 수 |
|---|---|---|
| 00. Unit | VariableCollectionId:26004:45162 | 57 |
| 00. Brand | VariableCollectionId:26049:40861 | 11 |
| 01. Theme | VariableCollectionId:1:412 | 160 |
| 02. Color Token | VariableCollectionId:1:444 | 68 |
| 03. TailwindCSS | VariableCollectionId:1:2 | 458 |
| 04. Custom | VariableCollectionId:17548:88924 | 26 |

추가로 빈 컬렉션(`Collection`, 변수 0개)이 하나 더 존재했다. Phase 0 완료 전 삭제 후보다.

또 `02. Color Token`의 Light 모드 이름이 "Ligjt"로 오타가 있었다. 작지만 API 호출 시 modeId로 참조하므로 실무 영향은 없다.

### Text Style 구조

총 314개. Tailwind CSS 명명 체계를 그대로 따르는 매트릭스 구조였다.

```
text-{size}/{leading}/{weight}
```

- **크기**: xxs(10) ~ 9xl(128), 14단계
- **leading**: leading-normal(px값), leading-none(100%)
- **weight**: thin ~ black + underlined/strikethrough, 11종

실제 Sandbox 페이지에서 사용 중인 로컬 Text Style은 1개뿐이었다. 나머지 313개는 라이브러리 스타일이거나 미사용이다.

## 회고: 수집과 반영을 분리하지 마라

세션을 닫기 전에 왜 진행이 막혔는지 따져봤다.

**핵심 문제**: 데이터를 얻었는데 파일에 쓰기 전에 다음 조회를 했다. 1차·2차 호출로 Phase 0-1 완료 조건(컬렉션 `unknown` 0건)을 이미 충족했는데, "더 완벽한 데이터"를 위해 3차 호출을 시도했다가 인터럽트를 맞았다.

결과적으로 두 번의 성공적인 Figma 조회가 있었지만 inventory.json에는 아무것도 반영되지 않았다.

교훈은 단순하다: **조회 → 즉시 반영 → 보고 → 다음 조회**. 이 순서를 지키면 세션이 끊겨도 진행 상태가 보존된다.

파이프라인 규칙에도 "서브스텝 완료 시마다 중간 보고 후 승인"이 명시되어 있었는데, 연속 호출로 이를 어겼다. 다음 세션에서는 각 Figma 호출 후 반드시 파일을 업데이트하고 보고하는 흐름을 지킬 것이다.

## 다음 세션

파이프라인 규칙을 보완한 뒤 Phase 0-1을 재개한다. 이미 확보된 컬렉션 ID를 inventory.json에 반영하는 것부터 시작한다. 추가 Figma 호출 없이 지금 가진 데이터만으로 가능하다.
