# Music Festival API

      This project provides an API for fetching, organizing, and sorting music festival data by record labels, bands, and festivals. It is built using NestJS, a progressive Node.js framework, and integrates structured logging, configuration management, and HTTP requests handling.

# Getting Started

    To get started with this project, follow the instructions below to set up and run the application.

# Prerequisites

      Before you begin, ensure you have the following installed:

          \*Node.js (v18.x.x or higher)

          \*Yarn

          \*Docker (for containerized deployment)

# Installation

      Clone the repository:git clone https://github.com/yourusername/music-festival-api.git

      cd music-festival-api

      Install dependencies using Yarn:yarn install

      Build the project:yarn build

# Running the Application

      You can run the application in different environments (development, production, etc.). The default port is 8081, but you can configure it using environment variables.

# Running in Development Mode :yarn start:dev

# Running in Production Mode :yarn start:prod

# Running with Docker

     To run the application in a Docker container:

          *Build the Docker image:docker-compose build

          *Start the container:docker-compose up

     The application will be available at http://localhost:8081.

# Environment Configuration

    The application uses environment variables to manage configuration. You can create environment-specific configuration files (e.g., .env.development, .env.production) to set these variables.

# Example .env file:

# Application port

PORT=8081

# External API URL

URL=https://eacp.energyaustralia.com.au/codingtest/api/v1/festivals

# Logging level

LOG_LEVEL=info

# Docker Support

    The project includes a Dockerfile and docker-compose.yml for building and running the application inside a Docker container. You can customize the environment by modifying these files.

# Testing

 This project uses Jest for unit and end-to-end testing.

# Running Tests

 yarn test

# Running Tests in Watch Mode

 yarn test:watch

# Running Test Coverage

 yarn test:cov

# Project Structure

    The project follows a modular structure, with the main modules being:

       *AppModule: The root module that imports other modules.
       *FestivalModule: Handles fetching and sorting festival data.
       *LoggerModule: Provides custom logging using winston.
       *ConfigModule: Manages application configuration.

# Key Files and Directories

    \*src/controllers/festival.controller.ts: The controller that handles HTTP requests related to festivals.
    \*src/services/festival.service.ts: The service that fetches and organizes festival data.
    \*src/services/logger.service.ts: The custom logger service using winston.

# Logging

    The application uses a custom logger service based on winston for structured logging. Logs are output to the console and a file (logs/app.log). Log levels and formats can be configured using environment variables.

# API Endpoints

     The application exposes the following endpoints:
          \*GET /festivals: Fetches and sorts festival data alphabetically by record label, band, and festival name.

# Contributing

     Contributions are welcome! Please fork this repository, make your changes, and submit a pull request. Ensure that your code adheres to the project's coding standards and includes appropriate tests.

# License

     This project is licensed under the MIT License. See the LICENSE file for details.
