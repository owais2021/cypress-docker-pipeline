# Use the official Cypress Docker image
FROM cypress/included:12.17.3

# Create a working directory inside the container
WORKDIR /e2e

# Copy the entire project directory contents into the container
COPY . .

# Install dependencies
RUN npm install

# Run Cypress tests by default
CMD ["npx", "cypress", "run"]
