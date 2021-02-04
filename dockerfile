FROM node:12.18-alpine
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY ./build .

COPY ./images ./images

EXPOSE ${PORT}

CMD ["node", "bot.js"]