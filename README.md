# RecoSphere

## Overview

RecoSphere is a robust **Single Page Application (SPA)** built using the **MERN stack** and enhanced by a **Spring Boot microservice** to deliver **personalized content discovery**. By integrating with the **TMDb API**, it provides users with a visually engaging, interactive platform for exploring movies and TV shows tailored to their preferences.

The application employs modern technologies to ensure scalability, responsiveness, and user-centric functionality, allowing for dynamic content discovery and real-time recommendations.

**Live Demo**: [RecoSphere on Render](https://reco-sphere.onrender.com/)

---

## Table of Contents

1. [The Problem RecoSphere Solves](#the-problem-recosphere-solves)
2. [Architecture Overview](#architecture-overview)
3. [Key Features](#key-features)
4. [Technical Implementation](#technical-implementation)
   - [Frontend](#frontend)
   - [Backend](#backend)
   - [Database](#database)
   - [Microservices](#microservices)
   - [Authentication and Authorization](#authentication-and-authorization)
5. [APIs](#apis)
   - [GraphQL API Highlights](#graphql-api-highlights)
6. [REST API Routes](#rest-api-routes)
7. [Controllers](#controllers)
8. [Core Functionalities](#core-functionalities)
9. [Development Workflow](#development-workflow)
10. [Deployment Workflow](#deployment-workflow)
11. [Technical Stack](#technical-stack)
12. [Future Enhancements](#future-enhancements)
13. [Acknowledgments](#acknowledgments)
14. [Contributor](#contributor)

---

## The Problem RecoSphere Solves

In an era of overwhelming entertainment options, users face the **paradox of choice**. With endless streaming services and massive catalogs, content discovery can be challenging.

**RecoSphere** simplifies this by offering:

| **Feature**                                | **Description**                                                                                 |
|--------------------------------------------|-------------------------------------------------------------------------------------------------|
| **Trending Movies & Shows**                | Stay updated with the latest and most popular content, curated for your interests.             |
| **Cross-Platform Sync**                    | Access your favorites, watchlists, and preferences seamlessly across all your devices.         |
| **Personalized Recommendations**           | Discover content tailored to your preferences using cutting-edge algorithms.                   |
| **Advanced Filtering**                     | *(In Progress)* Easily sort by genre, rating, and year to find what you're looking for.        |
| **Seamless Integration**                   | Enriched metadata powered by the TMDb API.                                                     |
| **Exclusive Features for Logged-in Users** | Logged-in users can add content to their favorites and enjoy a personalized experience.         |

---

## Architecture Overview

RecoSphere’s architecture emphasizes **scalability**, **modularity**, and **performance**:

- **Frontend**: Built using React and **Vite**, offering blazing-fast development builds, optimized production builds, and an enhanced developer experience with Hot Module Replacement (HMR).
- **Backend**: Node.js and Express.js serve as the foundation, with **Apollo Server** implementing the GraphQL API for efficient data querying and manipulation.
- **Database**: MongoDB hosted on **MongoDB Atlas**, a managed cloud cluster, paired with **Mongoose** for schema modeling and query optimization. Includes the following models:
  - **User Model**: Stores user data, including authentication credentials, preferences, and history.
  - **Favorites Model**: Tracks content items marked as favorites by users.
  - **Watchlist Model**: Manages content that users plan to watch, ensuring data integrity and optimized querying.
  - **Content Model**: Manages a rich catalog of metadata for movies and TV shows, including genres, ratings, and descriptions.
  - **Ratings Model**: Captures user ratings for content, influencing personalized recommendations.
  - **Recommendations Model**: Stores dynamically generated suggestions based on user behavior and preferences.
- **Microservices**: Spring Boot handles complex recommendation algorithms for tailored suggestions.
- **Authentication**: Secured with JWT-based authentication, ensuring safe and seamless user sessions.

### High-Level Architecture:

1. **Frontend**: React-based SPA built using **Vite** with TailwindCSS for styling.
2. **GraphQL API**: Exposed via **Apollo Server** for handling user management, recommendations, and content CRUD operations.
3. **Spring Boot Microservice**: Enhances backend with advanced recommendation logic (in progress).
4. **Database**: MongoDB hosted on **MongoDB Atlas**, optimized with **Mongoose** schemas for flexible and efficient data handling.

---

## Technical Stack

| **Category**       | **Technology**                                         |
| ------------------- | ------------------------------------------------------ |
| **Frontend**        | React, Vite, TailwindCSS, DaisyUI                      |
| **Backend**         | Node.js, Express.js, Apollo Server (GraphQL)           |
| **Database**        | MongoDB, MongoDB Atlas, Mongoose                       |
| **Microservices**   | Spring Boot                                            |
| **DevOps**          | GitHub Actions, Render                                 |
| **Testing**         | Jest, JUnit, Cypress, Postman                          |
| **Containerization**| Docker                                                 |

---

## Key Features

### Personalized Features

1. **Interactive SPA**  
   - Built with React Router for seamless, page-less navigation.  
   - Dynamic and responsive UI powered by TailwindCSS and DaisyUI.

2. **GraphQL API**  
   - Efficient querying for personalized data retrieval.  
   - Dynamic updates for user-specific recommendations and content.

3. **Recommendations Engine**  
   - Combines data from TMDb API with user preferences and history.  
   - Uses collaborative filtering and content-based filtering techniques.

4. **User Dashboard**  
   - Displays trending, popular, and tailored content for the user.  
   - Includes sorting and filtering by genre, rating, and release year.

5. **Secure Authentication**  
   - JWT-based authentication protects sensitive user data.  
   - Role-based access control for admin and user roles.

---

## Technical Implementation

### Frontend

- **Framework**: React with **Vite** for fast, optimized builds and hot module replacement (HMR).
- **Styling**: TailwindCSS + DaisyUI ensure responsiveness and accessibility.
- **Routing**: React Router for public and protected routes:
  - **ProtectedRoute**: Restricts access to authenticated users.
  - **PublicRoute**: Redirects logged-in users from login/register pages.
- **State Management**: Context API for global user state (authentication, preferences).

### Backend

- **Framework**: Node.js + Express.js.  
- **GraphQL API**:  
  - Implemented using **Apollo Server** for streamlined query and mutation handling.  
  - Resolvers manage user authentication, content operations, and personalized recommendations.  
  - Middleware validates JWTs for secure interactions.

### Database

- **MongoDB + MongoDB Atlas**:  
  - Cloud-hosted database cluster offering scalability and availability.  
  - Stores:
    - **User Data**: Credentials, preferences, and history.
    - **Content**: Metadata, genres, and ratings.
    - **Favorites and Watchlist**: User-managed collections.
    - **Recommendations**: Tailored suggestions for users.  
    - **Watchlist**: Tracks movies and TV shows users plan to watch, ensuring no duplicates via compound indexing on `userId` and `tmdbId`.
    - **Ratings**: User-submitted ratings for movies and TV shows to personalize recommendations.
  - **Mongoose**: Provides schema modeling and query abstraction, with unique constraints and indexes for performance optimization.

### Microservices

- **Spring Boot** (In Development):  
  - Advanced recommendation logic using collaborative and content-based filtering.  
  - RESTful endpoints provide recommendation data to the backend.  
  - Actively being developed to support real-time recommendation engines.

### Authentication and Authorization

- **JWT**:  
  - Stateless authentication ensures secure, scalable sessions.  
  - Middleware verifies tokens and attaches user context.

---

## APIs

### GraphQL API Highlights

RecoSphere’s GraphQL API offers efficient and dynamic data handling. Using queries and mutations, it allows for:

- Retrieving user profiles, content, favorites, and recommendations.
- Adding, updating, and deleting user-related data dynamically.

#### Queries

- **`getAllUsers`**: Fetches a list of all users (excluding sensitive fields).  
- **`getUserById(id: ID!)`**: Retrieves specific user details.  
- **`getFavorites`**: Retrieves the authenticated user’s favorite items.  
- **`getContent(filter: ContentInput)`**: Fetches content based on filters (e.g., genre, rating).  
- **`getRecommendations(userId: ID!)`**: Fetches personalized recommendations for a user.

#### Mutations

- **`registerUser(input: RegisterInput!)`**: Registers a new user and issues a JWT.  
- **`loginUser(input: LoginInput!)`**: Authenticates a user and returns a JWT.  
- **`addFavorite(tmdbId: String!, mediaType: String!)`**: Adds content to the user’s favorites.  
- **`updateFavorite(id: ID!, input: UpdateFavoriteInput!)`**: Updates favorite details.  
- **`deleteUser(id: ID!)`**: Deletes a user and associated data.

---

## Future Enhancements

- **Email Verification**: Add email validation during registration.  
- **Enhanced Recommendations**: Incorporate machine learning for smarter suggestions.  
- **Content Reviews**: Allow users to review and rate content directly.

---

## Acknowledgments

This product uses the **TMDb API** for fetching rich content metadata.

**Disclaimer**: This product is not endorsed or certified by TMDb.

---

## Contributor

RecoSphere is a solo project developed by **Mirasol Davila**.

**Live Demo**: [RecoSphere on Render](https://reco-sphere.onrender.com/)
