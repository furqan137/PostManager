FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Optional: update Browserslist DB
RUN npx browserslist@latest --update-db || true

# Copy the rest of the app
COPY . .

# Expose port used by Next.js
EXPOSE 3000

# Set environment
ENV NODE_ENV=development

# Start the app
CMD ["npm", "run", "dev"]

