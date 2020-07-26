FROM node:lts-alpine as api

WORKDIR /srv

COPY api/package.json /srv/
COPY api/package-lock.json /srv/
RUN npm install

COPY api/.sequelizerc /srv/
COPY api/sequelize-cli /srv/sequelize-cli/

COPY api/tsconfig.json /srv/

COPY api/src /srv/src

RUN npm run build

FROM node:lts-alpine as ui

COPY ui/package.json /srv/
COPY ui/package-lock.json /srv/

WORKDIR /srv/

RUN npm install

COPY ui /srv/

RUN npm run build

FROM node:lts-alpine as app

COPY --from=api /srv/.sequelizerc /srv/
COPY --from=api /srv/sequelize-cli /srv/sequelize-cli/
COPY --from=api /srv/package.json /srv/
COPY --from=api /srv/node_modules /srv/node_modules/
COPY --from=api /srv/dist /srv/
COPY --from=api /srv/src/images /srv/images
COPY --from=api /srv/src/fonts /srv/fonts

COPY --from=ui /srv/build /srv/app/build

WORKDIR /srv

ENTRYPOINT ["node", "server.js"]
