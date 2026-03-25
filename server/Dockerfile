FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install --production
COPY . .
RUN npx prisma generate && npx prisma db push
EXPOSE 3000
CMD ["node", "index.js"]