# RecoSphere

## Overview

RecoSphere is a sophisticated platform for personalized content discovery, leveraging modern technologies and best practices to deliver a scalable, user-focused solution. Built using a MERN stack with an integrated Spring Boot microservice, RecoSphere enriches the user experience by providing tailored recommendations through real-world API integrations like TMDb, OMDb, and TasteDive.

The project showcases expertise in designing, implementing, and optimizing a full-stack application with a focus on scalability, performance, and modern development workflows.

---

## The Problem RecoSphere Solves

Modern users face a paradox of choice when it comes to selecting movies and TV shows. RecoSphere addresses this challenge by offering:

- **Personalized Recommendations**: Tailored suggestions based on user preferences, ratings, and behavior.
- **Centralized Exploration**: A unified platform to discover trending, popular, and related content.
- **Real-Time Feedback Integration**: Dynamic recommendations that evolve based on user input, such as ratings and reviews.

---

## Key Features

### Frontend

- **Technology**: React, Vite, TypeScript, TailwindCSS, DaisyUI.
- **User Authentication**:
  - Secure registration and login with JWT-based session management.
- **Personalized Dashboard**:
  - Displays trending content, user-specific recommendations, and search results.
  - Advanced filters for genre, rating, and year to enhance content discovery.
- **Responsive Design**:
  - Mobile-first design optimized for cross-device accessibility using TailwindCSS utilities.

### Backend

- **Technology**: Node.js, Express.js, GraphQL.
- **GraphQL API**:
  - Queries: Fetch trending content and personalized recommendations.
  - Mutations: User registration, login, rating submission, and preference updates.
- **Recommendation Engine**:
  - Combines user preferences, behavior, and API-enriched metadata to deliver tailored suggestions.

### Database

- **Technology**: MongoDB with Mongoose.
- **Schema Design**:
  - Collections for users, content, and recommendations, with relationships optimized for fast query performance.
  - Dynamic updates to recommendations based on user interactions.

### Microservices

- **Spring Boot**:
  - Implements recommendation algorithms for real-time, personalized suggestions.
  - Integrates with MongoDB and provides RESTful endpoints for seamless communication with the frontend.

### Feedback Mechanism

- Users can rate and review content, dynamically refining recommendations for improved personalization.

### API Integrations

- **TMDb API**: Fetches metadata for movies and TV shows.
- **OMDb API**: Enriches content with IMDb ratings and additional details.
- **TasteDive API**: Suggests related content dynamically for enhanced discovery.

---

## Development Workflow

### Agile-Inspired Process

- Managed project scope using a systematic breakdown of tasks into milestones.
- Maintained clean, structured commits and organized the repository with clear documentation.

### CI/CD Pipeline

- Automated CI/CD pipelines using GitHub Actions for:
  - Linting and unit testing on every commit.
  - Cross-platform testing and deployment workflows.
- Advanced workflows include:
  - Static code analysis to maintain quality.
  - Artifact storage for build outputs.

### MongoDB Integration in CI/CD

- Leveraged GitHub Actions to spin up a MongoDB container for testing during the CI pipeline.
- Configured a `services` section to ensure MongoDB is available for backend tests:
  ```yaml
  services:
    mongodb:
      image: mongo:5.0
      ports:
        - 27017:27017
  ```
- This setup provides an isolated, disposable database environment during CI runs, ensuring consistency and repeatability for backend tests.

### Deployment

- Hosted on **Render**, deploying:
  - Frontend (React).
  - Backend (Node.js + GraphQL).
  - Microservices (Spring Boot).
- Achieved high availability and scalability through Render’s infrastructure.

---

## Technical Stack

| **Category**     | **Technology**                                         |
| ---------------- | ------------------------------------------------------ |
| Frontend         | React, Vite, TypeScript, TailwindCSS, DaisyUI          |
| Backend          | Node.js, Express.js, GraphQL (Apollo Server)           |
| Database         | MongoDB, Mongoose                                      |
| Microservices    | Spring Boot                                            |
| APIs             | TMDb, OMDb, TasteDive                                  |
| DevOps/Hosting   | GitHub Actions, Render                                 |
| Testing          | Jest, Cypress, JUnit, Mockito, MockMvc, Testcontainers |
| Containerization | Docker                                                 |

---

## Project Highlights

- **Scalability**: Designed a modular architecture combining GraphQL, microservices, and MongoDB for high performance and easy extensibility.
- **Performance**: Optimized API queries and implemented efficient database schemas to handle dynamic content updates and user interactions.
- **Security**: Employed JWT for secure authentication and environment variable management for API keys.
- **Responsive UI**: Built a mobile-first, visually appealing interface with accessible design principles.

---

## Why RecoSphere Stands Out

RecoSphere is more than just a recommendation platform; it demonstrates:

- Expertise in building end-to-end solutions with cutting-edge technologies.
- The ability to integrate external APIs to enhance functionality and user experience.
- A focus on delivering polished, production-ready applications with CI/CD pipelines and modern DevOps practices.
