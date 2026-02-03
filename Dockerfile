# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM nginx:alpine

# Create directory for nginx configuration
RUN mkdir -p /etc/nginx/conf.d

# Create custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage - CHANGED FROM 'dist' TO 'build'
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]