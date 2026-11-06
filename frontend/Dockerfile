# Build the react frontend
FROM node:22-alpine AS build

WORKDIR /app
# Copy dependency manifests first for better build caching
COPY package*.json ./
# install frontend dependencies
RUN npm ci
# copy the frontend source code
COPY . .
# configure Vite variables at build time
ARG VITE_BACKEND_URL=http://localhost:4000
ARG VITE_CURRENCY=Rs

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_CURRENCY=$VITE_CURRENCY

# Build the production frontend
RUN npm run build

# Stage 2: Serve the built files with Nginx
FROM nginx:alpine

# copy Vite's output into Nginx's web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Configure Nginx to forward API requests to the backend Service
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx listens on port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
