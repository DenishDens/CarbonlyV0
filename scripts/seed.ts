\
Let's update the docker-compose.yml file to remove unnecessary PostgreSQL services if we're only
using Supabase: ``
`yml file="docker-compose.yml"
[v0-no-op-code-block-prefix]version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: always
    networks:
      - carbonly-network

  # Local Supabase for development
  supabase:
    image: supabase/supabase-local
    ports:
      - "54321:54321" # API
      - "54322:54322" # Studio
    environment:
      POSTGRES_PASSWORD: postgres
      STUDIO_PORT: 54322
      API_PORT: 54321
    volumes:
      - supabase-data:/var/lib/postgresql/data
    networks:
      - carbonly-network

networks:
  carbonly-network:
    driver: bridge

volumes:
  supabase-data:

