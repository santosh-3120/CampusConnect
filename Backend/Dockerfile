# Use Node 22
FROM node:22

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies inside container and rebuild bcrypt for Linux
RUN npm install --build-from-source

# Copy the rest of the app
COPY . .

EXPOSE 3000

# Start the server
CMD ["npm", "start"]
