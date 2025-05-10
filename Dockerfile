FROM node:20.5.0-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]
