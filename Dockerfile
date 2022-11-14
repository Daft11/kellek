FROM node:18.4 as build
WORKDIR /app
COPY . .
RUN yarn --frozen-lockfile
RUN npm run build

FROM nginx as prod
WORKDIR /app
COPY --from=build /app/build /usr/share/nginx/html
VOLUME ./nginx/nginx.conf ./etc/nginx/nginx.conf

EXPOSE 80