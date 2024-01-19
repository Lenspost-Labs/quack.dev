import { Router } from "express";
const router = Router();

// functions
import { generateJWT } from "../../utils/auth/generateJWT";

router.post('/', (req, res) => {
  res.send('Login route');
  generateJWT({ id: 1, username: 'test'})
});

export default router;