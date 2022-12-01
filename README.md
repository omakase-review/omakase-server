# 오마카세-리뷰 서버

## 실행 방법

### 로컬

```sh
$ npm run build && npm run start // prod

$ npm run start:w // dev
```

### 도커

```bash
$ docker-compose up --build -d
$ npm run db:push
```

#### 주의 사항

1. 도커 실행 후 반드시 `npm run db:push` 실행해서 db에 테이블 생성을 해주어야 합니다.    
    ~~1.1 (`.env` 에서 `DATABASE_URL`을 localhost로 실행하시기 바랍니다.)~~

> 컨테이너 실행 순서를 보장하지 않기 때문에 테이블 생성을 따로 빼놓았습니다.

2. 위 테이블 생성 후 seed.ts를 실행 하시기 바랍니다.

> `npm run build && node ./dist/db/seed.js`

#### 도커 접속

```bash
$ docker exec -it <CONTAINER_NAME> /bin/bash
$ mysql -u omakase -p // 패스워드 입력 후 mysql 접속.
```
