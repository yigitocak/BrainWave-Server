import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      res.clearCookie("authToken");
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please log in again.",
        });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(403).json({
          success: false,
          message: "Token invalid",
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "Token verification failed",
        });
      }
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
