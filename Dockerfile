FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Normalement les variables d'environnement sont définies dans le .env
ENV DB_HOST=host.docker.internal
ENV DB_PORT=3306
ENV DB_USERNAME=ninja
ENV DB_PASSWORD=password
ENV DB_DATABASE=fontsninja

EXPOSE 3000


CMD ["npm", "run", "start"] 
