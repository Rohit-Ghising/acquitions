FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies (production only)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Runtime configuration
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Ensure "npm start" runs your Express server
CMD ["npm", "start"]
