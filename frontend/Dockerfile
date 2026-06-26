FROM nginx:alpine

# Copy static assets into nginx public folder
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
