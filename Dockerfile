FROM node:18.17-alpine AS Development
LABEL maintainer="Ruchin Munjal"
LABEL description="This is a simple Dockerfile example that creates an image for an API built on NEST JS."

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18.17-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=prod

COPY . .

COPY --from=Development /app/dist ./dist

CMD [ "node","dist/main" ]
