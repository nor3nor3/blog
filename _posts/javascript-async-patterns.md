---
title: "JavaScript 비동기 패턴: 콜백부터 async/await까지"
excerpt: "JavaScript의 비동기 처리 방식이 어떻게 발전해 왔는지 콜백, Promise, async/await 순서로 살펴봅니다. 각 방식의 장단점과 현대적인 패턴을 정리합니다."
coverImage: "/assets/blog/hello-world/cover.jpg"
date: "2025-01-28T09:00:00.000Z"
author:
  name: JJ Kasper
  picture: "/assets/blog/authors/jj.jpeg"
ogImage:
  url: "/assets/blog/hello-world/cover.jpg"
category: "JavaScript"
---

JavaScript는 싱글 스레드 언어임에도 비동기 작업을 효율적으로 처리할 수 있습니다. 그 방법이 어떻게 발전해 왔는지 살펴봅니다.

## 콜백 (Callback)

가장 오래된 방식입니다. 작업이 완료되면 호출할 함수를 인자로 전달합니다.

```javascript
function fetchData(url, onSuccess, onError) {
  setTimeout(() => {
    if (url) onSuccess({ data: "결과" });
    else onError(new Error("URL 없음"));
  }, 1000);
}

fetchData(
  "https://api.example.com",
  (data) => console.log(data),
  (err) => console.error(err)
);
```

**문제점**: 콜백이 중첩되면 "콜백 지옥"이 발생합니다.

```javascript
// 콜백 지옥
getUser(id, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      // 점점 깊어지는 중첩...
    });
  });
});
```

## Promise

ES2015(ES6)에서 도입된 Promise는 콜백 지옥을 해결합니다.

```javascript
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, name: "홍길동" });
      else reject(new Error("유효하지 않은 ID"));
    }, 500);
  });
}

fetchUser(1)
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error(err))
  .finally(() => console.log("완료"));
```

### Promise.all vs Promise.allSettled

```javascript
// 하나라도 실패하면 전체 실패
const [user, posts] = await Promise.all([
  fetchUser(1),
  fetchPosts(1),
]);

// 모든 결과를 받고, 성공/실패 여부 확인
const results = await Promise.allSettled([
  fetchUser(1),
  fetchUser(999), // 실패
]);

results.forEach(result => {
  if (result.status === "fulfilled") console.log(result.value);
  else console.error(result.reason);
});
```

## async/await

ES2017에서 도입. Promise 위에서 동작하며 동기 코드처럼 읽힙니다.

```javascript
async function loadDashboard(userId) {
  try {
    const user = await fetchUser(userId);
    const [posts, followers] = await Promise.all([
      fetchPosts(user.id),
      fetchFollowers(user.id),
    ]);
    return { user, posts, followers };
  } catch (err) {
    console.error("대시보드 로드 실패:", err);
    throw err;
  }
}
```

## 실전 패턴: 재시도 로직

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      const delay = attempt * 1000; // 지수 백오프
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## 실전 패턴: 동시성 제한

```javascript
async function processInBatches(items, batchSize, handler) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(handler));
  }
}

// API 제한이 있을 때: 한 번에 5개씩만 처리
await processInBatches(urls, 5, fetchAndSave);
```

## 마치며

현대 JavaScript 개발에서는 `async/await`이 표준입니다. 하지만 내부적으로는 여전히 Promise이므로, Promise의 메서드(`all`, `allSettled`, `race`, `any`)를 함께 활용하면 더욱 강력한 비동기 코드를 작성할 수 있습니다.
