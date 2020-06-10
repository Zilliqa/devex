FROM node:12.16.3-alpine3.11
WORKDIR /app
COPY ./package.json ./
RUN yarn install
COPY . ./
CMD ["yarn", "build"]

FROM nginx 
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html