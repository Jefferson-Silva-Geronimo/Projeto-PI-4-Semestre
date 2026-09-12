FROM node:22-alpine

WORKDIR /app

# openssl é necessário pelo engine do Prisma no Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
COPY prisma7.config.ts ./

RUN npm ci
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
