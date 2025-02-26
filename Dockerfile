FROM node:22

COPY package.json .

RUN npm install -y

COPY server.js .

EXPOSE 3000

ENTRYPOINT npm start