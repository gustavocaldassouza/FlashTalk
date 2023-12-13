# Stage 1: Build Angular App
FROM node:lts-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Use Nginx to Serve the Built Angular App
FROM nginx:alpine

# Copy the built Angular app from the previous stage
COPY --from=builder /usr/src/app/dist/ /usr/share/nginx/html

# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port that Nginx will run on
EXPOSE 80

# CMD is not needed here since the default CMD of the Nginx image will start Nginx
