const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const comparePasswords = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];

  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split the bearer token from the header
    const bearer = bearerHeader.split(" ");

    // Get token from array
    const bearerToken = bearer[1];

    // Set the token
    req.token = bearerToken;

    // Verify token
    jwt.verify(req.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized." });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    // Forbidden
    return res.status(403).json({ message: "Forbidden." });
  }
}

module.exports = {
  hashPassword,
  comparePasswords,
  verifyToken,
};
