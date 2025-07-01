#!/bin/bash

echo "Removing existing container..."
docker rm -f nqbinhcs-website

# Build the Docker image
docker build -t nqbinhcs-website .

# Run the container
docker run -d -p 8060:80 --name nqbinhcs-website nqbinhcs-website

echo "Website is now running at http://localhost:8060"
echo "To stop the container, run: docker ps (to get container ID) and then docker stop <container_id>"
