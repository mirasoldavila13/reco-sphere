/**
 * Auth Middleware
 *
 * This middleware protects backend routes by verifying JSON Web Tokens (JWTs).
 * It ensures only authenticated and authorized users can access sensitive
 * operations by validating tokens passed in the `Authorization` header.
 *
 * Features:
 * - **Token Extraction**: Retrieves the JWT from the `Authorization` header in
 *   the format `Bearer <token>`.
 * - **Token Verification**: Validates the token's authenticity using the server's
 *   secret key (`JWT_SECRET`).
 * - **User Context**: Decodes the token and attaches the user's information to
 *   the `req` object for use in subsequent middleware or route handlers.
 *
 * Error Handling:
 * - **401 Unauthorized**: Responds when the token is missing from the request header.
 * - **403 Forbidden**: Responds when the token is invalid, expired, or cannot be verified.
 *
 * Use Case:
 * - Apply this middleware to any backend route requiring authentication.
 *   Example: Protecting routes for creating or updating user profiles, managing
 *   sensitive data, or accessing user-specific resources.
 *
 * Technologies and Dependencies:
 * - **jsonwebtoken (JWT)**: Used for decoding and verifying JWT tokens efficiently
 *   against the server's secret key.
 * - **Express.js Middleware Pattern**: Integrates seamlessly with Express.js for
 *   request-response handling.
 *
 * Implementation Flow:
 * 1. Extract the token from the `Authorization` header.
 * 2. If no token is found, respond with a `401 Unauthorized` status.
 * 3. Verify the token using `jsonwebtoken.verify()`:
 *    - If valid, decode the payload and attach it to `req.user`.
 *    - If invalid, respond with a `403 Forbidden` status.
 * 4. Proceed to the next middleware or route handler upon successful verification.
 *
 * Security Considerations:
 * - Ensure the `JWT_SECRET` is stored securely and not exposed.
 * - Tokens should have an appropriate expiration time to minimize the impact of a
 *   potential token leak.
 * - Validate user roles and permissions in downstream handlers if needed.
 *
 * Example Usage:
 * ```javascript
 * import protectRoute from './middlewares/authMiddleware.js';
 * app.post('/protected-route', protectRoute, (req, res) => {
 *   res.json({ message: `Welcome, ${req.user.name}!` });
 * });
 */

import jwt from "jsonwebtoken";

/**
 * Middleware to protect routes by verifying JWT.
 */
const protectRoute = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default protectRoute;
