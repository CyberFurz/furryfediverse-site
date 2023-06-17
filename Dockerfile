# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Temp db for build
ENV DATABASE_URL="file:./temp.db"

# Run any build scripts
RUN yarn prisma generate
RUN yarn prisma migrate deploy
RUN yarn build

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD [ "yarn", "start" ]