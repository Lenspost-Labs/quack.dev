import { Router } from "express";

const userRouter = Router();

userRouter.get('/', (req, res) => {
  res.send('User route');
});

export default userRouter;