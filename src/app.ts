import express from "express";
require('dotenv').config();

// routes
import auth from "./routes/auth";
import user from "./routes/user";

// middleware
import authMiddleware from './middleware/auth';

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

app.use('/auth', auth);
app.use('/user', user);

app.listen(PORT);

console.log(`Server running on port ${PORT}`)