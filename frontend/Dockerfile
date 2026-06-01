# Stage 1: Build React Application
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first for caching layers
COPY package*.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Pass build arguments
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build the project
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

# Copy built files from the build stage to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx config for routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
