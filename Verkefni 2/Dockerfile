FROM node:18

WORKDIR /code

COPY package*.json ./

EXPOSE 3000

RUN npm i

COPY . .

CMD [ "node", "index.js" ]

