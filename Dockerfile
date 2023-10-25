# 🏡 Build
FROM node:20.4-alpine AS build

WORKDIR /app

ENV NODE_ENV production

COPY package*.json .

RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN npm run build && npx prisma migrate && npm prune --production

USER node

# 🚀 Production
FROM node:20.4-alpine as prod

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD [ "node", "dist/apps/auth/main.js" ]