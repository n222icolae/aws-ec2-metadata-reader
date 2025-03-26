FROM node:22.13-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY .npmrc ./

COPY index.ts ./
COPY src ./src
COPY tsconfig.json ./

RUN npm i

RUN npm install -g typescript@5.8.2

RUN npm run build

ENTRYPOINT ["node", "dist/index.js"]

CMD [""]
