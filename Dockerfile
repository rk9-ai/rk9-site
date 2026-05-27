# RK9 AI marketing site — static build served by nginx.
# Stage 1: build the Vite bundle. Stage 2: nginx:alpine serving dist/.

FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
# Container nginx: gzip, immutable-asset caching, SPA fallback, /healthz.
COPY deploy/nginx/container.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=3 --start-period=5s \
    CMD wget -qO- http://127.0.0.1:80/healthz || exit 1
