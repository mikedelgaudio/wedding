# Stage 1: Build the Vite/React app
FROM node:22-alpine AS builder

# Set working directory for the build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy application source
COPY . .

# Build-time args for Firebase public config (defaults to empty)
ARG VITE_REACT_APP_FIREBASE_API_KEY
ARG VITE_REACT_APP_FIREBASE_AUTH_DOMAIN
ARG VITE_REACT_APP_FIREBASE_PROJECT_ID
ARG VITE_REACT_APP_FIREBASE_STORAGE_BUCKET
ARG VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_REACT_APP_FIREBASE_APP_ID
ARG VITE_REACT_APP_FIREBASE_APP_CHECK_SITE_KEY

# Expose to Vite build
ENV VITE_REACT_APP_FIREBASE_API_KEY=${VITE_REACT_APP_FIREBASE_API_KEY}
ENV VITE_REACT_APP_FIREBASE_AUTH_DOMAIN=${VITE_REACT_APP_FIREBASE_AUTH_DOMAIN}
ENV VITE_REACT_APP_FIREBASE_PROJECT_ID=${VITE_REACT_APP_FIREBASE_PROJECT_ID}
ENV VITE_REACT_APP_FIREBASE_STORAGE_BUCKET=${VITE_REACT_APP_FIREBASE_STORAGE_BUCKET}
ENV VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID}
ENV VITE_REACT_APP_FIREBASE_APP_ID=${VITE_REACT_APP_FIREBASE_APP_ID}
ENV VITE_REACT_APP_FIREBASE_APP_CHECK_SITE_KEY=${VITE_REACT_APP_FIREBASE_APP_CHECK_SITE_KEY}

# Build production assets
RUN npm run build

# Stage 2: Production image
FROM nginx:stable-alpine AS production

# Override IPv6 helper with a no-op to avoid entrypoint write errors
COPY conf/noop-ipv6.sh /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
RUN chmod +x /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

# Copy Nginx global and site configs
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/site.conf  /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user, prepare runtime dir, and set permissions
RUN addgroup -S app && adduser -S app -G app \
    && mkdir -p /run \
    && chown -R app:app \
       /usr/share/nginx/html \
       /run \
       /etc/nginx/nginx.conf \
       /etc/nginx/conf.d/default.conf

# Switch to non-root and set working directory
USER app
WORKDIR /usr/share/nginx/html

# Expose HTTP port (explicit TCP)
EXPOSE 8080/tcp

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
