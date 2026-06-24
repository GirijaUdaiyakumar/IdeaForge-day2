const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;
  console.log("AUTH:", req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(
      "Bearer"
    )
  ) {
    token =
      req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = decoded.id;
    
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  }
  
  if (!token) {
    return res.status(401).json({
      message: "No token",
    });
  }
};

module.exports = { protect };