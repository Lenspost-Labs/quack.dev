import { Router } from "express";
import createCast from "../../utils/user/createCast";
import getCasts from "../../utils/user/getCasts";
import getFeed from "../../utils/user/getFeed";
import getCast from "../../utils/user/getCast";

const router = Router();

router.post("/", async (req, res) => {
  let user = req.user?.id;
  let postData = req.body;

  await createCast(user as string, postData);

  res.send({
    message: "Cast created",
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

export default router;
