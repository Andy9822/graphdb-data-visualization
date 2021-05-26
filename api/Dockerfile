FROM node:12

RUN mkdir -p /app
WORKDIR /app

COPY . .
RUN yarn add graphql
RUN yarn install
RUN yarn build

EXPOSE 4001

CMD ["yarn", "start"]