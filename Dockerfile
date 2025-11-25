# ==========================
# Etapa 1: Build del frontend (SvelteKit/Vite)
# ==========================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ==========================
# Etapa 2: Servir con nginx (runtime)
# ==========================
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

# OJO: aquí usamos /app/build, no /app/dist
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
