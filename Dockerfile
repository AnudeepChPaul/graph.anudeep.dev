FROM node:alpine3.12

RUN mkdir -p /app
workdir /app

copy . .

run rm -rf node_modules
run rm -rf build
# run rm -rf .ssl

run mv .env.dev .env.prod

run yarn install
# run yarn setup
# run yarn gen-certs

run yarn build:prod

cmd ["yarn", "watch:prod"]

