# Maple Suite — one image, builds every app; container picks its app via $APP.
FROM node:22-bookworm-slim
WORKDIR /repo
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY . .
RUN npm install && npm run build
# Lightweight production static server for the apex marketing site (apps/web/dist).
RUN npm install -g serve@14
EXPOSE 3000
# APP is set per-service in compose (e.g. quotations, accounts)
CMD ["sh","-c","npm run -w @maple/app-${APP} start -- -p 3000 -H 0.0.0.0"]
