# Docker file from node alpine

FROM node:20-alpine

RUN corepack enable

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "preview", "--port", "3000", "--host", "0.0.0.0"]