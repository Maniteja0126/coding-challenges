## REST API with Node.js and Express

This repository contains a simple RESTful API built with Node.js, Express, and TypeScript. It includes CRUD operations for managing todo tasks.

## Features
- RESTful API endpoints for managing todo tasks:
  - **GET /todos**: Fetch all todos
  - **POST /todos**: Create a new todo
  - **PUT /todos/:id**: Update an existing todo
  - **DELETE /todos/:id**: Delete a todo by ID
- TypeScript for type-safe development
- Dockerfile for containerization

## Getting Started
To get a local copy up and running follow these simple steps.

## Installation
1. Clone the repository:
    ```bash
        git clone https://github.com/Maniteja0126/coding-challenges.git
        cd backend/REST-APIs
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Build TypeScript files:
    ```bash
    npm run build
    ```
4. Start the server using the compiled JavaScript files:
    ```bash
    npm run start
    ```


Docker Deployment
To run the application using Docker, follow these steps:

1. Build the Docker image:
    ```bash
    docker build -t rest-api .
    ```
2. Run the Docker container:
    ```bash
    docker run -p 3000:3000 rest-api
    ```


## Usage
Once the server is running, you can use tools like Postman or cURL to interact with the API endpoints.

Example requests:

```bash
    GET http://localhost:3000/todos
    POST http://localhost:3000/todos
    PUT http://localhost:3000/todos/:id
    DELETE http://localhost:3000/todos/:id
```
