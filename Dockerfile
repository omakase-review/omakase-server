FROM node:18.12-alpine AS base
WORKDIR /app
COPY package-lock.json package.json ./
COPY tsconfig.json ./
RUN npm ci
COPY src src
COPY .env ./
COPY prisma prisma

# Check below issue [prisma]
# https://github.com/prisma/prisma/issues/14073#issuecomment-1348534199
RUN apk add --update --no-cache openssl1.1-compat

RUN npm run db:generate
RUN npm run build

RUN chmod 777 /app/node_modules/.prisma/client/index.js
RUN chown -R node:node /app/node_modules/.prisma

RUN mkdir logs
RUN chmod -R 777 /app/logs
# RUN npx prisma push

USER node
CMD ["npm", "start"]
