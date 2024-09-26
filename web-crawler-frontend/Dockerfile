FROM node:21.7.2-slim as build

WORKDIR /opt/vite

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.25.4
COPY --from=build ./opt/vite/dist /usr/share/nginx/html

COPY ./nginx/default.conf.template /etc/nginx/templates/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]