import { Router } from "express";
import imagekit from "../../utils/clients/imagekit";
const router = Router();

router.get("/image", async (req, res) => {
  res.send(imagekit.getAuthenticationParameters());
});

export default router;