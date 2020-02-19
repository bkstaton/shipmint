FROM node:lts-alpine as backend

WORKDIR /srv

COPY .sequelizerc /srv/
COPY sequelize-cli /srv/sequelize-cli/
COPY package.json /srv/
COPY package-lock.json /srv/
RUN npm install

COPY tsconfig.json /srv/

COPY src /srv/src

RUN npm run build

FROM node:lts-alpine as frontend

COPY src/app/package.json /srv/
COPY src/app/package-lock.json /srv/

WORKDIR /srv/

RUN npm install

COPY src/app /srv/

RUN npm run build

FROM node:lts-alpine as app

COPY --from=backend /srv/.sequelizerc /srv/
COPY --from=backend /srv/sequelize-cli /srv/sequelize-cli/
COPY --from=backend /srv/package.json /srv/
COPY --from=backend /srv/node_modules /srv/node_modules/
COPY --from=backend /srv/dist /srv/

COPY --from=frontend /srv/build /srv/app/build

WORKDIR /srv

ENTRYPOINT ["node", "server.js"]
