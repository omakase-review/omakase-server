# 오마카세-리뷰 서버

## 실행 방법

`.env` 파일이 있어야 합니다.

### 로컬

```sh
$ npm run build && npm run start // prod

$ npm run start:w // dev
```

### 도커

```bash
$ docker-compose up --build -d
```

### seed

1.  seed.js 실행
    -   `npm install -g dotenv-cli` 사용.
2.  엑셀파일 경로
    -   src/db/\*
    *   다운로드 : https://www.notion.so/3490e796b8514a8996e9fb9da8251ed8

```sh
$ npm run build
$ dotenv -e .env -- node ./dist/db/seed/seed.js
```

#### 도커 접속

```bash
$ docker exec -it <CONTAINER_NAME> /bin/bash
$ mysql -u omakase -p // 패스워드 입력 후 mysql 접속.

$ docker exec -it <CONTAINER_NAME> redis-cli // redis 접속
```
