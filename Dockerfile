# Stage 1: Build the Vite/React app
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy the rest of the source code
COPY . .

# Declare build-time arguments for Firebase env vars
ARG VITE_REACT_APP_FIREBASE_API_KEY
ARG VITE_REACT_APP_FIREBASE_AUTH_DOMAIN
ARG VITE_REACT_APP_FIREBASE_PROJECT_ID
ARG VITE_REACT_APP_FIREBASE_STORAGE_BUCKET
ARG VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_REACT_APP_FIREBASE_APP_ID
ARG VITE_REACT_APP_FIREBASE_APP_CHECK_SITE_KEY

# Expose them to Vite at build time
ENV VITE_REACT_APP_FIREBASE_API_KEY=${VITE_REACT_APP_FIREBASE_API_KEY}
ENV VITE_REACT_APP_FIREBASE_AUTH_DOMAIN=${VITE_REACT_APP_FIREBASE_AUTH_DOMAIN}
ENV VITE_REACT_APP_FIREBASE_PROJECT_ID=${VITE_REACT_APP_FIREBASE_PROJECT_ID}
ENV VITE_REACT_APP_FIREBASE_STORAGE_BUCKET=${VITE_REACT_APP_FIREBASE_STORAGE_BUCKET}
ENV VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID}
ENV VITE_REACT_APP_FIREBASE_APP_ID=${VITE_REACT_APP_FIREBASE_APP_ID}
ENV VITE_REACT_APP_FIREBASE_APP_CHECK_SITE_KEY=${VITE_REACT_APP_FIREBASE_APP_CHECK_SITE_KEY}

# Build the production assets
RUN npm run build


# Stage 2: Serve with nginx (as a non-root user)
FROM nginx:stable-alpine AS production

# Copy built assets and custom nginx config
COPY --from=builder /app/dist /usr/share/nginx/html
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

# Create a non-root user and adjust ownership
RUN addgroup -S app && adduser -S app -G app \
    && chown -R app:app /usr/share/nginx/html /var/cache/nginx /var/run

# Drop to non-root
USER app

# Expose an unprivileged port (map host port 80 to container port 8080)
EXPOSE 8080

# Healthcheck for container orchestration
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost:8080/healthz || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
