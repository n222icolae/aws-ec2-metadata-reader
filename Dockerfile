FROM node:22.13-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY .npmrc ./
COPY tsconfig.json ./
COPY src ./src
COPY index.ts ./

RUN npm run build

FROM node:22.13-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/.npmrc ./

RUN npm ci --only=production

USER node

ENTRYPOINT ["node", "dist/index.js"]
