# Use official Node.js image (Alpine for smaller size)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies separately to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Optional: Update Browserslist DB, but make it non-blocking
RUN npx browserslist@latest --update-db || true

# Copy application code
COPY . .

# Expose Next.js default dev port
EXPOSE 3000

# Set environment (adjust if using production image later)
ENV NODE_ENV=development

# Default command to run the development server
CMD ["npm", "run", "dev"]

