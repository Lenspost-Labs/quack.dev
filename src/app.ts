import express from "express";
require('dotenv').config();

// routes
import auth from "./routes/auth";

const PORT = process.env.PORT || 3000;

const app = express();

app.use('/auth', auth);

app.listen(PORT);

console.log(`Server running on port ${PORT}`)