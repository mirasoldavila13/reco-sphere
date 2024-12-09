/**
 * Auth Middleware
 *
 * Middleware for protecting backend routes by verifying JWT tokens.
 *
 * Features:
 * - Extracts the JWT token from the `Authorization` header.
 * - Verifies the token using the server's secret key.
 * - Attaches decoded user information to the request object for downstream use.
 *
 * Error Handling:
 * - Responds with `401 Unauthorized` if no token is provided.
 * - Responds with `403 Forbidden` if the token is invalid or expired.
 *
 * Dependencies:
 * - `jsonwebtoken`: For verifying and decoding JWT tokens.
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
