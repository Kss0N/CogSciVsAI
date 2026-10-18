# === STAGE 1: Build the React application ===
FROM node:20-bookworm-slim AS builder


# Set the working directory to `/app`
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code and build it
COPY . .
RUN npm run build

# === STAGE 2: Serve the static files with Nginx ===
FROM nginx:bookworm
WORKDIR /app

# Copy the built static files from Stage 1 to Nginx's html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom Nginx config to handle React Router routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the network
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
