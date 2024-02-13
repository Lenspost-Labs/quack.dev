import { Router } from "express";
import router from "./post";
import { getSuggestedUsername } from "../../utils/user/getSuggestedUsername";
import updateUserData from "../../utils/user/updateUserData";
import followUser from "../../utils/user/followUser";
import unFollowUser from "../../utils/user/unFollowUser";

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

userRouter.post("/follow", async (req, res) => {
  let user_id = req.user?.id as string;
  let target_fid = req.query.target_fid as any as number;

  await followUser(user_id, target_fid);

  res.send({
    message: "User followed",
  });
});

userRouter.post("/unfollow", async (req, res) => {
  let user_id = req.user?.id as string;
  let target_fid = req.query.target_fid as any as number;

  await unFollowUser(user_id, target_fid);

  res.send({
    message: "User unfollowed",
  });
});

userRouter.use("/post", router);

export default userRouter;
