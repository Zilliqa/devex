FROM node:12.16.3 as build-stage
ARG REACT_APP_DEPLOY_ENV="dev"
ENV REACT_APP_DEPLOY_ENV=$REACT_APP_DEPLOY_ENV
WORKDIR /app
COPY ./package.json ./
RUN yarn install 
COPY . ./
RUN yarn build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
