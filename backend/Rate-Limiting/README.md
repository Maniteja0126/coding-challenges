# Node.js Rate Limiting Example

This repository provides an example of implementing rate limiting in a Node.js application using the Express framework and the `express-rate-limit` middleware.

## Table of Contents

- [Introduction](#introduction)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Testing](#testing)


## Introduction

Rate limiting is a technique used to control the rate of incoming requests to a server. It helps protect your application from abuse and ensures fair usage among users. This example demonstrates how to use the `express-rate-limit` middleware to implement rate limiting in an Express application.

## Folder Structure

This repository contains two folders: `attack` and `rate-limiter`.

- The `attack` folder contains a simple script that sends multiple requests to the server in a short period.
- The `rate-limiter` folder contains the Express application with rate limiting implemented.

## Prerequisites

- Node.js (v12.x or higher)
- npm (v6.x or higher)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/rate-limiting-example.git
    cd rate-limiting-example
    ```

2. Install the dependencies for both the `attack` and `rate-limiter` folders:

    ```bash
    cd attack
    npm install
    ```

    ```bash
    cd ../rate-limiter
    npm install
    ```

## Usage

1. Run the server and the attack script in different terminals:

    - Terminal 1: Start the rate limiting server:

    ```bash
    cd rate-limiter
    node index.js
    ```

    - Terminal 2: Start the attack script:

    ```bash
    cd attack
    node index.js
    ```

2. Try to send the `generate-otp` request using Postman or another HTTP client.

3. Observe the terminal for logs.

4. Run the `attack` script, which sends multiple requests.

5. Observe the response in the postman. You should see that after 5 requests, the server starts to block additional requests due to rate limiting.

6. Edit the `auth.route.js` script in the `rate-limiter` folder under the `Routes` directory. Remove the rate limiting middleware from both the `otpLimiter` and `passwordLimiter` routes.

7. Restart the server and the attack script:

    - Terminal 1:

    ```bash
    node index.js
    ```

    - Terminal 2:

    ```bash
    node index.js
    ```

8. Observe the logs again. You will see that the server is no longer blocking requests even after multiple requests, allowing the attack script to reset the password as defined.

## Configuration

You can customize the rate limiting behavior by modifying the options passed to the `express-rate-limit` middleware. Here are some additional options you can use:

- `windowMs`: The time window for rate limiting in milliseconds (e.g., `15 * 60 * 1000` for 15 minutes).
- `max`: The maximum number of requests allowed per `windowMs` from a single IP (e.g., `100` requests).
- `message`: The message sent to clients when the rate limit is exceeded (e.g., `'Too many requests from this IP, please try again after 15 minutes'`).

## Testing

You can test the rate limiting functionality using tools like Postman or curl to send multiple requests to your server and observe the responses.
