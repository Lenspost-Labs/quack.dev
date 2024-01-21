# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies (omit devDependencies)
RUN npm install --only=production

COPY .env .env
# Copy the rest of your application code to the working directory
COPY . .

# Build your TypeScript code
RUN npm run build

# Expose the port that your Express app is listening on
EXPOSE 3000

# Command to run your Express app
CMD ["npm", "start"]
