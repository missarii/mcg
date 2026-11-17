# Multi-stage Dockerfile for NestJS backend
# Stage 1: Build dependencies and compile
FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY backend/src ./src
RUN npm run build

# Stage 2: Runtime with compiled code
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY backend/package*.json ./

EXPOSE 3000
CMD ["node", "dist/main.js"]