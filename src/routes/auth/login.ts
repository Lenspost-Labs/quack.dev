import { Router } from "express";

const router = Router();

router.post('/', (req, res) => {
  res.send('Login route');
});

export default router;