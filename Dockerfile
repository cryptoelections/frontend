FROM node:9.5 as builder

LABEL builder=1

COPY package.json package-lock.json /tmp/frontend/
WORKDIR /tmp/frontend
RUN npm install

COPY ./ /tmp/frontend/
RUN npm run build

# package static content
FROM nginx:stable-alpine

COPY --from=builder /tmp/frontend/dist/ /usr/local/nginx/html/
#COPY --from=builder /tmp/frontend/dist/ /var/www/html/
