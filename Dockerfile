# Use an official Node runtime as a parent image
FROM node:22-alpine

# Set the working directory to /app
WORKDIR /app

# Install app dependencies
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Temp db for build
ENV DATABASE_URL="file:./temp.db"

# Run any build scripts
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run build

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose the port that the app will run on
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=3000

# Start the app
CMD [ "npm", "run", "start" ]