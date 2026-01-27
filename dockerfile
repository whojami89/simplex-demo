# Image with preinstalled browsers
FROM mcr.microsoft.com/playwright:v1.49.0-noble

# Main directory
WORKDIR /app

# Copy package configs
COPY package*.json ./

# Dependencies installation
RUN npm ci

# Whole code copy
COPY . .

# Run tests
CMD ["npx", "playwright", "test"]