---
title: "프론트엔드 개발자를 위한 Docker 입문"
excerpt: "프론트엔드 개발자가 알아야 할 Docker 핵심 개념과 실전 사용법을 정리합니다. Next.js 앱을 Docker로 컨테이너화하고 docker-compose로 개발 환경을 구성하는 방법을 배웁니다."
coverImage: "/assets/blog/preview/cover.jpg"
date: "2024-09-15T09:00:00.000Z"
author:
  name: Joe Haddad
  picture: "/assets/blog/authors/joe.jpeg"
ogImage:
  url: "/assets/blog/preview/cover.jpg"
category: "Dev"
---

Docker는 이제 백엔드 개발자만의 영역이 아닙니다. 프론트엔드 개발자도 Docker를 이해하면 일관된 개발 환경 구성, 배포 자동화, 백엔드와의 협업이 훨씬 수월해집니다.

## Docker의 핵심 개념

- **이미지(Image)**: 컨테이너의 설계도. 읽기 전용 레이어의 집합.
- **컨테이너(Container)**: 이미지를 실행한 인스턴스. 격리된 프로세스.
- **Dockerfile**: 이미지를 빌드하는 명령어 집합.
- **docker-compose**: 여러 컨테이너를 함께 정의하고 실행하는 도구.

## Next.js Dockerfile

```dockerfile
# Stage 1: 의존성 설치
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Stage 2: 빌드
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Stage 3: 프로덕션 실행
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 필요한 파일만 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

멀티 스테이지 빌드를 사용하면 최종 이미지 크기를 크게 줄일 수 있습니다.

## .dockerignore

```
node_modules
.next
.git
*.md
.env*.local
```

## docker-compose로 개발 환경 구성

```yaml
# docker-compose.yml
version: "3.8"

services:
  web:
    build:
      context: .
      target: deps
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    command: yarn dev

  api:
    image: my-backend:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

```bash
# 개발 환경 시작
docker compose up

# 백그라운드 실행
docker compose up -d

# 로그 확인
docker compose logs -f web

# 종료
docker compose down
```

## 자주 쓰는 Docker 명령어

```bash
# 이미지 빌드
docker build -t my-app:latest .

# 컨테이너 실행
docker run -p 3000:3000 my-app:latest

# 실행 중인 컨테이너 확인
docker ps

# 컨테이너 내부 접속
docker exec -it <container-id> sh

# 이미지 목록
docker images

# 사용하지 않는 리소스 정리
docker system prune
```

## 환경 변수 관리

```yaml
# docker-compose.yml
services:
  web:
    env_file:
      - .env.local    # 로컬 개발용
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8080
```

> **주의**: `.env` 파일에 시크릿을 담은 경우 절대 Docker 이미지에 포함시키지 마세요. 런타임에 주입하거나 시크릿 관리 도구를 사용하세요.

## 마치며

Docker를 배우면 "내 컴퓨터에선 되는데..."라는 문제가 사라집니다. 처음에는 낯설 수 있지만, 한 번 익숙해지면 개발 환경 설정과 배포가 훨씬 간단해집니다.
