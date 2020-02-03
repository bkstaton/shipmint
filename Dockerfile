FROM node:lts-alpine as build

COPY ./src ./src

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
RUN npm run build

FROM node:lts-alpine as app

COPY --from=build ./dist ./
COPY package.json package-lock.json ./
RUN npm install --production

ENTRYPOINT ["node", "server.js"]
