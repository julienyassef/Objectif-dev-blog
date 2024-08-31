# Utiliser l'image de base officielle de Node.js
FROM node:18-alpine AS base

# Installer les dépendances système nécessaires
RUN apk add --no-cache autoconf automake libtool nasm build-base pkgconfig libc6-compat libjpeg-turbo-dev

WORKDIR /app

# Étape pour installer les dépendances
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Étape pour construire l'application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Étape de production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN mkdir -p /app/public/uploads/pictures /app/public/uploads/videos && \
    chown -R nextjs:nodejs /app && \
    chmod -R 755 /app/public/uploads

USER nextjs

EXPOSE 3001
ENV PORT=3001

CMD ["node", "server.js"]
