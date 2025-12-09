# build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build  # генерирует .output/

# runtime
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NITRO_PORT=3000 NITRO_HOST=0.0.0.0 NODE_ENV=production
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]