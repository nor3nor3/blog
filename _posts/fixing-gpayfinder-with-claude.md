---
title: "Claude와 함께 지역화폐 가맹점 지도를 고친 하루"
excerpt: "네이버 지도 SDK 인증 오류부터 빈 화면, 잘못된 필드명, 로딩 성능, 클러스터링 UX까지. 경기지역화폐 가맹점 지도 앱을 하나씩 뜯어고친 과정."
coverImage: "/assets/blog/dynamic-routing/cover.jpg"
date: "2026-04-07T00:00:00.000Z"
author:
  name: 명진
  picture: "/assets/blog/authors/jj.jpeg"
ogImage:
  url: "/assets/blog/dynamic-routing/cover.jpg"
category: "개발일지"
---

경기지역화폐 가맹점 지도 앱을 Claude와 함께 고쳤다. 처음엔 단순한 인증 오류 하나를 잡으러 들어갔는데, 건드릴수록 고칠 게 나왔다. 오늘 작업한 것들을 순서대로 기록한다.

## 네이버 지도 SDK 인증 오류

가장 먼저 마주친 건 `Cannot read properties of null (reading 'LatLng')` 에러였다. NCP(Naver Cloud Platform)가 언제부터인가 SDK 파라미터와 도메인을 바꿨는데, 코드는 예전 방식을 그대로 쓰고 있었다.

| 구분 | 이전 | 현재 |
|------|------|------|
| 파라미터 | `ncpClientId` | `ncpKeyId` |
| 도메인 | `openapi.map.naver.com` | `oapi.map.naver.com` |

SDK URL을 바꾸고 나서 또 다른 문제가 생겼다. 새 SDK는 `callback=` URL 파라미터를 지원하지 않아서, 콜백이 `naver` 전역 객체가 세팅되기 전에 호출됐다. 동적 스크립트 삽입 방식으로 바꾸고 `s.onload = resolve`로 처리했다.

```js
function loadNaverSDK(clientId) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`;
    s.onload = resolve;
    s.onerror = () => reject(new Error('네이버 지도 SDK 로드 실패'));
    document.head.appendChild(s);
  });
}
```

## 지도가 초기화되는데 화면이 하얀 문제

인증은 해결됐는데 지도가 여전히 보이지 않았다. `state.map.getCenter()`는 정상 좌표를 반환하고, 19,000개 가맹점 로드도 완료됐는데 타일이 없었다.

콘솔에서 컨테이너 크기를 직접 찍어봤다.

```js
JSON.stringify(document.getElementById('map').getBoundingClientRect())
// → {"x":0,"y":0,"width":807,"height":0,...}
```

`height: 0`이었다. `position: fixed; inset: 0`만으로는 Naver Maps SDK가 컨테이너 크기를 제대로 읽지 못했다. `width: 100%; height: 100%`를 명시하니 해결됐다.

```css
#map { position: fixed; inset: 0; width: 100%; height: 100%; }
```

## 가게 이름이 전부 "이름없음"

지도는 떴는데 마커를 누르면 모든 가게가 "이름없음"으로 표시됐다. 공공데이터 API 응답의 실제 필드명을 확인해보니 코드에서 쓰던 것과 달랐다.

```js
// 실제 응답
{
  "CMPNM_NM": "화보리헤어 36.5권선점",
  "INDUTYPE_NM": "미용실",
  ...
}
```

코드는 `BIZPLC_NM`과 `INDUTY_NM`을 읽고 있었다. 없는 필드를 읽으니 `undefined → '이름없음'`으로 폴백된 것. 필드명을 고치니 이름도, 업종 필터도 한 번에 살아났다. 필터가 "전체"와 "기타"만 동작하던 것도 같은 원인이었다—업종명이 항상 빈 문자열이라 모든 가맹점이 "기타"로 분류됐던 것.

## 로딩 성능 개선

가장 오래 걸리는 작업이 로딩이었다. 문제는 세 가지였다.

**1. 페이지 순차 요청**
수원시 기준 약 20페이지를 하나씩 기다리며 받았다. `await`와 `sleep(150)` 조합이라 페이지당 최소 150ms가 낭비됐다. 첫 페이지를 받아 즉시 렌더한 뒤, 나머지 페이지는 `Promise.all`로 병렬 요청하도록 바꿨다.

**2. 매번 전체 재로드**
처리 완료된 가맹점 데이터를 캐시하지 않아서 새로고침마다 API를 전부 다시 호출했다. localStorage에 24시간 TTL로 저장해두면 재방문 시 즉시 렌더된다.

```js
function loadMerchantCache(sigunNm) {
  try {
    const raw = localStorage.getItem(`gpf_merchants_v1_${sigunNm}`);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts < 24 * 60 * 60 * 1000) return data;
  } catch (_) {}
  return null;
}
```

**3. 좌표 없는 가맹점 geocoding 블로킹**
약 444개 가맹점에 좌표가 없어서 Kakao geocoding API를 순차 호출했다. 전체 19,645개 중 2.3%인데 이걸 기다리느라 로딩 스피너가 오래 떴다. 좌표 있는 것만 먼저 렌더하고, 나머지는 완전 백그라운드에서 처리하도록 분리했다.

## 초기 뷰 조정

기본 줌 레벨(13)이 수원시 전체가 보일 만큼 넓어서 초기 화면에 마커가 너무 많았다. 위치 권한을 SDK 로드와 병렬로 요청해서 허용 시 내 위치 기준 zoom 16(반경 약 500m)으로 시작하도록 했다.

```js
const [, userPos] = await Promise.all([
  loadNaverSDK(cfg.naverMapClientId),
  getUserLocation(),
]);
initMap(userPos, GEO_ZOOM);
```

위치를 거부해도 수원시 기준으로 동일한 zoom 16에서 시작한다.

## 겹치는 마커 처리

같은 건물에 여러 가게가 있으면 마커가 완전히 겹쳐서 하나만 탭할 수 있었다. 같은 좌표 그룹을 감지해서 두 개 이상이면 숫자 뱃지가 달린 마커로 표시하고, 탭하면 해당 위치의 가게 목록 패널을 띄웠다.

```js
function renderIndividual(merchants) {
  const groups = new Map();
  merchants.forEach(m => {
    const key = `${m.lat},${m.lng}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(m);
  });
  groups.forEach(group => {
    const count = group.length;
    const icon = count === 1 ? markerIcon(group[0].category) : stackIcon(count);
    // ...
  });
}
```

## 클러스터링 튜닝

기존 클러스터링 임계값(zoom 14)은 초기 zoom 16에서 클러스터가 전혀 없다는 뜻이었다. 임계값을 17로 올리고, zoom 13~16 구간의 격자 크기도 세분화했다. 처음엔 너무 조밀하다는 피드백을 받아서 격자를 약 3배 키웠다.

```js
const gridDeg = zoom < 9  ? 0.4
              : zoom < 11 ? 0.15
              : zoom < 12 ? 0.08
              : zoom < 13 ? 0.04
              : zoom < 14 ? 0.02
              : zoom < 15 ? 0.01
              : zoom < 16 ? 0.005
              :              0.003;
```

zoom 16 기준 셀 하나가 약 330m라 같은 블록 안의 가게들은 자연스럽게 묶인다.

## 마무리

오늘 고친 것들 대부분은 "실행해보기 전까지 모르는 종류"였다. 인증 파라미터 변경, 필드명 불일치, 컨테이너 height 0 같은 것들은 문서만 봐서는 잡기 어렵다. Claude와 작업할 때 좋은 점은 콘솔 출력이나 API 응답을 그대로 붙여넣으면 원인을 바로 짚어준다는 것이다. 디버깅 반복 속도가 확실히 빨라진다.
