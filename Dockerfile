FROM node:9.5 as builder

RUN mkdir /tmp/frontend

LABEL builder=1
WORKDIR /tmp/frontend

RUN npm install
COPY . /tmp/frontend

RUN npm rebuild node-sass
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /tmp/frontend/dist /usr/share/nginx/html
