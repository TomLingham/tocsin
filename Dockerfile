FROM node:15.5.0-alpine3.12

RUN mkdir /app
WORKDIR /app

COPY packages/worker ./worker
COPY packages/server/dist ./server

WORKDIR ./server

RUN npm link ../worker
RUN ls -la

CMD ["node", "index.js"]
