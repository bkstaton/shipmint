FROM node:lts-alpine as build

COPY ./src ./src

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
RUN npm run build

WORKDIR src/app
RUN npm install
RUN npm run build

FROM node:lts-alpine as app

COPY package.json package-lock.json ./
RUN npm install --production

COPY --from=build ./dist ./

COPY --from=build ./src/app/build ./app/build

ENTRYPOINT ["node", "server.js"]
