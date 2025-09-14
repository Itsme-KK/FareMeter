# ---------- Build Stage ----------
FROM node:18-alpine AS builder
WORKDIR /app

# install build dependencies (including typescript)
COPY package*.json ./
RUN npm install

# copy source and build
COPY . .
RUN npm run build   # produces dist/

# ---------- Runtime Stage ----------
FROM node:18-alpine
WORKDIR /app

# install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# copy compiled output only
COPY --from=builder /app/dist ./dist

# Do NOT copy .env here; use docker-compose env_file or secrets to inject envs at runtime
EXPOSE 8000
CMD ["node", "dist/index.js"]

#FROM node:18-alpine

#WORKDIR /app

#COPY package*.json ./

# Use npm install instead of ci, because no package-lock.json
#RUN npm install --omit=dev

#COPY . .

#RUN npm run build

#EXPOSE 8000
#CMD ["node", "dist/index.js"]