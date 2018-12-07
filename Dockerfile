FROM node:10-alpine AS dev

ENV APP_HOME=/opt/app
RUN mkdir -p ${APP_HOME}
WORKDIR ${APP_HOME}

CMD [ "npm", "start" ]

FROM dev AS prod

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm install --production

COPY . ./

CMD [ "node", "index.js" ]
