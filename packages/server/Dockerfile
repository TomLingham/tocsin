FROM node:15.5.0-alpine3.12

RUN mkdir /app
WORKDIR /app

# Don't do this...
RUN npm i @tocsin/worker@1.0.1

COPY dist/index.js dist/index.js.map ./

CMD ["node", "index.js"]
