FROM node:12.16.3-alpine3.11
ARG REACT_APP_DEPLOY_ENV="dev"
ENV REACT_APP_DEPLOY_ENV=$REACT_APP_DEPLOY_ENV
WORKDIR /app
COPY ./package.json ./
RUN yarn install 
COPY . ./
RUN yarn build