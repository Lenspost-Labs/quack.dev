import { Router } from "express";
import router from "./post";
import { getSuggestedUsername } from "../../utils/user/getSuggestedUsername";
import updateUserData from "../../utils/user/updateUserData";
import followUser from "../../utils/user/followUser";
import unFollowUser from "../../utils/user/unFollowUser";
import doesFollow from "../../utils/user/doesFollow";
import updateUserDataOnHub from "../../utils/user/updateUserDataOnHub";
import getDetailsForFID from "../../utils/user/getDetailsForFID";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("User route");
});

userRouter.post("/set-username-email", async (req, res) => {
  try{ 
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
} catch (e) {
  console.log(e);
  res.status(500).send({
    message: "Internal server error",
  });
}
});

userRouter.get("/suggested-username-pfp", async (req, res) => {
  let user_id = req.user?.id;
 let username = await getSuggestedUsername(user_id as string)
 res.send(username);
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

userRouter.get("/does-follow", async (req, res) => {
  let user_id = req.user?.id as string;
  let target_fid = req.query.target_fid as any as number;

  let doesFollowUser = await doesFollow(user_id, target_fid);

  res.send({
    doesFollowUser,
  });
});

userRouter.post("/metadata", async (req, res) => {
  let user_id = req.user?.id as string;
});

userRouter.get("/about", async (req, res) => {
  let user_id = req.user?.id as string;
  let target_fid = req.query.target_fid as any as number;

  let user_info = await getDetailsForFID(user_id,target_fid);

  res.send(
    user_info,
  );
});

userRouter.use("/post", router);

export default userRouter;
