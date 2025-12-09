# syntax=docker/dockerfile:1.6

FROM node:22-bullseye-slim AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
ENV NODE_ENV=development
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN --mount=type=cache,id=yarn-cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile

FROM deps AS build
COPY . .
RUN yarn build  # генерирует .output/

FROM node:22-bullseye-slim AS runtime
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

COPY --from=build /app/.output ./.output
COPY --from=build /app/.data ./.data

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
