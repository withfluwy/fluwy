# Docker file from node alpine

FROM node:20-alpine

ARG PORT=3000

ENV PORT=${PORT}

RUN corepack enable

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE ${PORT}

CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "${PORT}"]