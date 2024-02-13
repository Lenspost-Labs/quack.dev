import { Router } from "express";
import createCast from "../../utils/user/createCast";
import getCasts from "../../utils/user/getCasts";
import getFeed from "../../utils/user/getFeed";
import getCast from "../../utils/user/getCast";
import deleteCast from "../../utils/user/deleteCast";
import actOnFrame from "../../utils/user/actOnFrame";
import addReactionForCast from "../../utils/casts/addReactionForCast";
import removeReactionForCast from "../../utils/casts/removeReactionForCast";
import { ReactRequest, ChildHashRequest } from "../../types";
import getCommentsForCast from "../../utils/casts/getCommentsForCast";

const router = Router();

router.post("/", async (req, res) => {
  try {
    let user = req.user?.id;
    let postData = req.body;

    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    await createCast(user, postData);

    res.send({ message: "Cast created" });
  } catch (error) {
    res.status(500).send({ message: "Failed to create cast" });
  }
});

router.delete("/", async (req, res) => {
  try {
    let user = req.user?.id;
    let hash = req.query.hash as string;

    if (!user || !hash) {
      return res.status(400).send({ message: "Missing parameters" });
    }

    await deleteCast(user, hash);

    res.send({ message: "Cast deleted" });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete cast" });
  }
});

router.post("/react", async (req, res) => {
  try {
    let { fid, hash, reaction, type } = req.body as ReactRequest;
    let user_id = req.user?.id;

    if (!fid || !hash || !reaction || typeof user_id === 'undefined') {
      return res.status(400).send({ message: "Missing parameters" });
    }

    if (reaction !== 1 && reaction !== 2) {
      return res.status(400).send({ message: "Invalid reaction" });
    }

    hash = hash.replace("0x", "");

    let castId = {
      fid,
      hash: new Uint8Array(Buffer.from(hash, "hex")),
    };

    if (type === 1) {
      await addReactionForCast(user_id, castId, reaction);
    } else if (type === -1) {
      await removeReactionForCast(user_id, castId, reaction);
    } else {
      return res.status(400).send({ message: "Invalid type" });
    }

    res.send({ message: `Reaction ${reaction} submitted` });
  } catch (error) {
    res.status(500).send({ message: "Failed to process reaction" });
  }
});

router.get("/", async (req, res) => { 
  try {
    let user = req.user?.id;

    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    let casts = await getCasts(user);

    res.send({ casts });
  } catch (error) {
    res.status(500).send({ message: "Failed to get casts" });
  }
});

router.get("/feed", async (req, res) => {
  try {
    let user = req.user?.id;
    let limit = parseInt(req.query.limit as string) || 10; // Provide a default limit

    let feed = await getFeed(limit); 

    res.send(feed);
  } catch (error) {
    res.status(500).send({ message: "Failed to get feed" });
  }
});

router.post("/frame", async (req, res) => {
  try {
    let user_id = req.user?.id;
    let { hash, castId, buttonIndex, inputText, url } = req.body;

    if (!hash || !castId || typeof buttonIndex === 'undefined' || !url || typeof user_id === 'undefined') {
      return res.status(400).send({ message: "Missing parameters" });
    }

    await actOnFrame(user_id, { buttonIndex, castId, inputText, url });

    res.send({ message: "Frame action submitted" });
  } catch (error) {
    res.status(500).send({ message: "Failed to perform frame action" });
  }
});

router.get("/child", async (req, res) => {
  try {
    let user_id = req.user?.id;
    let { fid, hash } = req.query as any as ChildHashRequest; // Adjusted to use req.query

    if (!fid || !hash || typeof user_id === 'undefined') {
      return res.status(400).send({ message: "Missing parameters" });
    }

    hash = hash.replace("0x", "");

    let castId = {
      fid,
      hash: new Uint8Array(Buffer.from(hash, "hex")),
    };

    let child_response = await getCommentsForCast(castId); 
    res.send(child_response);
  } catch (error) {
    res.status(500).send({ message: "Failed to get comments for cast" });
  }
});

export default router;
