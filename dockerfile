FROM alpine/git as getImages
WORKDIR /images
RUN git clone "https://github.com/laynH/Anime-Girls-Holding-Programming-Books.git" . && rm -rf ./.git

FROM node:14.16-alpine
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY --from=getImages ./images ./images
COPY . .

EXPOSE ${PORT}

CMD ["npm", "start"]