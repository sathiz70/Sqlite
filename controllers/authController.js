const jwt = require("jsonwebtoken");
const sqlite = require("../sqlite");
const { hashPassword, comparePasswords } = require("../helper/utils");
const registerValidator = require("../validators/registerValidator");
const loginValidator = require("../validators/loginValidator");
require("dotenv").config();

async function register(req, res) {
  const { error } = registerValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password);
  try {
    const user = await getUserByEmail(email);
    if (user) {
      return res.status(409).json({ error: "Email already exists" });
    }
    await insertUser(email, hashedPassword);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/v1/auth/refresh_token",
    });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    sqlite.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function insertUser(email, password) {
  return new Promise((resolve, reject) => {
    sqlite.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, password], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  register,
  login,
};
