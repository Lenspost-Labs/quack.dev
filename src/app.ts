import express from "express";
import cors from "cors";
import compression from "compression";
require("dotenv").config();

// routes
import auth from "./routes/auth";
import user from "./routes/user";
import helper from "./routes/helper";

// middleware
import authenticate from "./middleware/auth";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

app.use(cors());
app.use(compression());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/auth", auth);
app.use("/user",authenticate, user);
app.use("/helper", authenticate,helper);

app.listen(PORT);

console.log(`Server running on port ${PORT}`);
