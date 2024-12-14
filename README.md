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
- **Database**: MongoDB hosted on **MongoDB Atlas**, a managed cloud cluster, paired with **Mongoose** for schema modeling and query optimization.
  - Stores:
    - **User Data**: Credentials, preferences, and history.
    - **Content**: Metadata, genres, and ratings.
    - **Favorites**: User-managed collections of favorite content.
    - **Watchlist**: Content users plan to watch, optimized with compound indexing for user-specific data.
    - **Ratings**: User-submitted ratings for movies and TV shows, enhancing personalized recommendations.
    - **Recommendations**: Tailored suggestions generated by analyzing user behavior.
- **Microservices**: Spring Boot handles complex recommendation algorithms for tailored suggestions (currently in development).
- **Authentication**: Secured with JWT-based authentication, ensuring safe and seamless user sessions.

### High-Level Architecture:

1. **Frontend**: React-based SPA built using **Vite** with TailwindCSS for styling.
2. **GraphQL API**: Exposed via **Apollo Server** for handling user management, recommendations, and content CRUD operations.
3. **Spring Boot Microservice**: Enhances backend with advanced recommendation logic (in progress).
4. **Database**: MongoDB hosted on **MongoDB Atlas**, optimized with **Mongoose** schemas for flexible and efficient data handling.

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

## Technical Stack

| **Category**       | **Technology**                                         |
| ------------------- | ------------------------------------------------------ |
| **Frontend**        | React, Vite, TailwindCSS, DaisyUI                      |
| **Backend**         | Node.js, Express.js, Apollo Server (GraphQL), CORS     |
| **Database**        | MongoDB, MongoDB Atlas, Mongoose                       |
| **Microservices**   | Spring Boot                                            |
| **API Integration** | TMDb API, axios                                        |
| **Authentication**  | bcrypt, JWT                                            |
| **DevOps**          | GitHub Actions, Render                                 |
| **Testing**         | Jest, JUnit, Cypress                                   |
| **Containerization**| Docker                                                 |

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
