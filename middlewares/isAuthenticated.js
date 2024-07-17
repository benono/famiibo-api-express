const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.userId;
    req.familyId = decoded.familyId;
    console.log(decoded)
    next();
  });
}

module.exports = isAuthenticated;
