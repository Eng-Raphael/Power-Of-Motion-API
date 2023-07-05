FROM node:18-alpine

WORKDIR /usr/src/PowerOfMotionAPI

COPY package*.json ./
COPY ./uploads ./uploads

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run" , "dev" ]