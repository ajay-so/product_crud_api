require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
