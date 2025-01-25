#!/bin/bash

# Function to check if containers are running
check_running() {
  containers=$(docker ps --filter "name=nextjs-dev-env" -q)
  if [ ! -z "$containers" ]; then
    echo "Found running containers with prefix 'nextjs-dev-env'"
    return 0
  fi
  return 1
}

# Function to stop all project containers
stop_containers() {
  docker compose down
  echo "Stopped all project containers"
}

# Function to remove all project containers and volumes
nuke() {
  docker compose down -v
  docker volume prune -f
  rm -rf .next
  echo "Removed all containers, volumes, and Next.js build"
}

case "$1" in
  "check")
    check_running
    ;;
  "stop")
    stop_containers
    ;;
  "nuke")
    nuke
    ;;
  *)
    echo "Usage: ./manage-docker.sh [check|stop|nuke]"
    exit 1
    ;;
esac