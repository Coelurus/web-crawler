FROM node:21.7.2-slim as build
WORKDIR /opt/vite
COPY package.json package-lock.json ./
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.25.4
COPY --from=build ./opt/vite/dist /usr/share/nginx/html
COPY ./nginx/default.conf.template /etc/nginx/templates/default.conf.template


# Use envsubst to replace environment variables in the Nginx config before starting Nginx
CMD ["/bin/sh", "-c", "envsubst '${SERVER_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]


EXPOSE 80