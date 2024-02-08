import { Router } from "express";
import router from "./post";
import { getSuggestedUsername } from "../../utils/user/getSuggestedUsername";
import updateUserData from "../../utils/user/updateUserData";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("User route");
});

userRouter.post("/set-username-email", async (req, res) => {
  let user_id = req.user?.id as string;
  let { username, email } = req.body;

  if (username) {
    let username_res = await updateUserData(user_id, username);
    if (!username_res) {
      return res.status(400).send({
        message: "Username is not available",
      });
    }
  }

  email && (await updateUserData(user_id, undefined, email));

  res.send({
    message: "User data updated successfully",
  });
});

userRouter.get("/suggested-username-pfp", async (req, res) => {
  let user_id = req.user?.id;
  getSuggestedUsername(user_id as string).then((username: string[]) => {
    res.send({
      username,
    });
  });
});

userRouter.use("/post", router);

export default userRouter;
