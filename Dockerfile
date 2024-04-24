FROM node:20.12.1

RUN mkdir /app
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

RUN apt-get update

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app/
