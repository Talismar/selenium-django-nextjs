## Backend - Setup

Install dependencies

```sh
pip install -r requirements.txt
```

Setup database

```sh
python manage.py migrate
```

---

## Run tests

```sh
python manage.py test
```

---

## Frontend - Setup

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
