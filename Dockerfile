FROM node:18.4 as build
WORKDIR /app
COPY . .
RUN yarn --frozen-lockfile
RUN npm run build

FROM nginx:1.18 as prod
WORKDIR /app
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80