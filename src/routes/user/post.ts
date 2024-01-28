import { Router } from "express";
import createCast from "../../utils/user/createCast";

const router = Router();

router.post("/",async (req, res) => {
  let user = req.user?.id;
  let postData = req.body;

  await createCast(user as string, postData);

  res.send({
    message: "Cast created",
  });
});

export default router;
