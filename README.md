# NestJS REST API

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Docker image build
```bash
# build dev image
$ docker build -t nestjs-rest-api-dev -f Dockerfile.dev .

# build prod image
$ docker build -t nestjs-rest-api-prod -f Dockerfile.prod .
```

### Docker container run
```bash
# dev image
$ docker run -p 3000:3000 nestjs-rest-api-dev

# prod image
$ docker run -p 5000:5000 nestjs-rest-api-prod
```

### Docker compose
```bash
# development mode
$ docker-compose -f docker-compose.dev.yml up

# production mode
$ docker-compose -f docker-compose.prod.yml up
```

### Run & use NestJs app container
```bash
$ docker exec -it rest_api bash
```

### Run & use PostgreSQL database container
```bash
$ docker exec -it postgres bash

# in the container
$ psql -U pguser -h postgres -p 5432 nestjs_contact_manager
```
