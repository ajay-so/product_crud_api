const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../utils/logger");

// register user route
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Login User
const loginUser = async (req, res) => {
  const startTime = Date.now();

  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      logger({
        action: "Login Failed - User Not Found",
        api: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userEmail: username,
        duration: Date.now() - startTime,
        input: { username },
        output: {},
        error: "Invalid credentials",
      });

      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger({
        action: "Login Failed - Wrong Password",
        api: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userEmail: username,
        duration: Date.now() - startTime,
        input: { username },
        output: {},
        error: "Invalid credentials",
      });

      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logger({
      action: "Login Success",
      api: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userEmail: user.email,
      duration: Date.now() - startTime,
      input: { username },
      output: { token },
    });

    res.status(200).json({ token });
  } catch (err) {
    logger({
      action: "Login Error",
      api: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userEmail: req.body?.username || "Unknown",
      duration: Date.now() - startTime,
      input: { username: req.body?.username },
      output: {},
      error: err.message,
    });

    res.status(500).json({ message: err.message });
  }
};

module.exports = {registerUser, loginUser};