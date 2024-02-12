import { Router } from "express";
import createCast from "../../utils/user/createCast";
import getCasts from "../../utils/user/getCasts";
import getFeed from "../../utils/user/getFeed";
import getCast from "../../utils/user/getCast";
import actOnFrame from "../../utils/user/actOnFrame";
import addReactionForCast from "../../utils/casts/addReactionForCast";

const router = Router();

router.post("/", async (req, res) => {
  let user = req.user?.id;
  let postData = req.body;

  await createCast(user as string, postData);

  res.send({
    message: "Cast created",
  });
});

router.post("/react", async (req, res) => {
  let { castId, reaction } = req.body;
  let user_id = req.user?.id as string;

  (castId && reaction) ||
    res.status(400).send({ message: "Missing parameters" });

  reaction === 1 ||
    reaction === 2 ||
    res.status(400).send({ message: "Invalid reaction" });

  await addReactionForCast(user_id, castId, reaction);

  res.send({
    message: "Reaction added",
  });
});

router.get("/", async (req, res) => {
  let user = req.user?.id;
  let casts = await getCasts(user as string);

  res.send({
    casts: casts,
  });
});

router.get("/feed", async (req, res) => {
  let user = req.user?.id;
  let limit = parseInt(req.query.limit as string);

  let feed = await getFeed(limit);

  res.send(feed);
});

router.post("/frame", async (req, res) => {
  let user_id = req.user?.id as string;
  let { hash, castId, buttonIndex, inputText, url } = req.body;

  (hash && castId && buttonIndex && url) ||
    res.status(400).send({ message: "Missing parameters" });

  await actOnFrame(user_id, {
    buttonIndex: buttonIndex,
    castId: castId,
    inputText: inputText,
    url: url,
  });

  res.send({
    message: "Frame action submitted",
  });
});

export default router;
