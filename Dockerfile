FROM node:20

WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy backend source code
COPY backend/ ./

# Build the application from src to dist
RUN npm run build

# Expose port
EXPOSE 4000

# Start the application (runs from dist/index.js)
CMD ["npm", "start"]
