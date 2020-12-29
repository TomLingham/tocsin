FROM node:15.5.0-alpine3.12

RUN mkdir /app
WORKDIR /app

RUN npm i @tocsin/worker

COPY dist/index.js dist/index.js.map ./

CMD ["node", "index.js"]
