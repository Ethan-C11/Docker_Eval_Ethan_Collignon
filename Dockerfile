FROM node:22

WORKDIR /app

COPY package.json .

RUN npm install -y

COPY server.js .

RUN mkdir -p /app/logs && chown -R node:node /app/logs
USER node

EXPOSE 3000

ENTRYPOINT npm start