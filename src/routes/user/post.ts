import { Router } from "express";
import createCast from "../../utils/user/createCast";
import getCasts from "../../utils/user/getCasts";

const router = Router();

router.post("/",async (req, res) => {
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

export default router;
