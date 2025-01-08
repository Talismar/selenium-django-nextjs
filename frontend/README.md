## Setup

Install dependencies

```sh
npm i
```

## Run local

```sh
npm run dev
```

## Run Docker

Build the frontend container

```sh
docker build -t nextjs-docker .
```

Run the frontend container

```sh
docker run -p 3000:3000 nextjs-docker
```