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
$ npm run db:push // .env 파일에서 localhost 실행
```

#### 도커 접속

```bash
$ docker exec -it /bin/bash
$ mysql -u omakase -p // 패스워드 입력 후 mysql 접속.
```
