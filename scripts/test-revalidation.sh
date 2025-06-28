#!/bin/bash

# Test revalidation in Docker container
echo "Testing revalidation..."

# Get the container ID
CONTAINER_ID=$(docker ps --filter "ancestor=furryfediverse-site" --format "{{.ID}}")

if [ -z "$CONTAINER_ID" ]; then
    echo "No container found. Make sure your Docker container is running."
    exit 1
fi

echo "Found container: $CONTAINER_ID"

# Test the cache endpoint
echo "Calling cache endpoint..."
docker exec $CONTAINER_ID curl -X GET http://localhost:3000/api/instances/cache

echo ""
echo "Calling revalidation endpoint..."
docker exec $CONTAINER_ID curl -X POST http://localhost:3000/api/revalidate

echo ""
echo "Revalidation test complete!" 