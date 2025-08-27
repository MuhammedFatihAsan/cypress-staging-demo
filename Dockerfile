# Uygulamayı çalıştıran image (Express backend + statik frontend)
FROM node:20-alpine
WORKDIR /app

# Prod bağımlılıkları yükle
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Uygulama kaynaklarını kopyala
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
