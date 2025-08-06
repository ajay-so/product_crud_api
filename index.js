require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
// const rateLimit = require("express-rate-limit");
// const cron = require("node-cron");

// Cron Job
// cron.schedule("* * * * *", () => {
//   console.log("Cron job executed");
// });

// const limiter = rateLimit({
// 	windowMs: 1 * 60 * 1000, // 1 minutes
// 	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// 	message : "Too many requests from this IP, please try again after 15 minutes"
// })

// Apply the rate limiting middleware to all requests.


const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(limiter)

// Routes
app.use("/products", productRoutes);
app.use("/auth", authRoutes);

// MongoDB Connection
const mongo_url = process.env.MONGO_URL;
mongoose.connect(mongo_url)
  .then(() => console.log("Connected with MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Start server
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
