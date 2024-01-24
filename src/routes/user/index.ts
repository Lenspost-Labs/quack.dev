import { Router } from "express";
import router from "./post";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("User route");
});

userRouter.use("/post", router);

export default userRouter;
