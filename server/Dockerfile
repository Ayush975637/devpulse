FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./


RUN npm install 
COPY . .
RUN npx prisma generate

RUN npm prune --production
EXPOSE 3000
CMD ["node", "index.js"]