# Conquer & Command

## Install with Docker

```
docker build -tag conquer-and-command .
docker run --name conquer-and-command --rm -v "$PWD":/usr/src/app -p 8080:8080 -d conquer-and-command
docker exec -it conquer-and-command npm install
```

## Run in development mode

```
docker exec -it conquer-and-command npm run dev
```
