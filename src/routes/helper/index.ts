import { Router } from "express";
import imagekit from "../../utils/clients/imagekit";
import axios from "axios";
import cheerio from "cheerio";
import searchUsername from "../../utils/user/searchUsername";
import checkIfUsernameAvailable from "../../utils/user/checkIfUsernameAvailable";
const router = Router();

router.get("/image", async (req, res) => {
  res.send(imagekit.getAuthenticationParameters());
});

router.get("/fetch-og", async (req, res) => {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).send({ error: "URL query parameter is required." });
  }

  try {
    const { data } = await axios.get<string>(url);
    const $ = cheerio.load(data);
    const ogTags: { [key: string]: string } = {};

    $("meta").each((_, element) => {
      const property = $(element).attr("property");
      const content = $(element).attr("content");

      if (
        property &&
        (property.includes("og:") || property?.includes("fc:")) &&
        content
      ) {
        ogTags[property] = content;
      }
    });

    res.json(ogTags);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch or parse the URL." });
  }
});

router.get("/search-username", async (req, res) => {
  const q = req.query.q as string;

  if (!q) {
    return res.status(400).send({ error: "q query parameter is required." });
  }

  try {
    let search = await searchUsername(q);
    res.send(search);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch or parse the URL." });
  }
});

router.get("/is-username-available", async (req, res) => {
  const username = req.query.username as string;

  if (!username) {
    return res
      .status(400)
      .send({ error: "username query parameter is required." });
  }

  try {
    let search = await checkIfUsernameAvailable(username);
    res.send({
      available: search,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch or parse the URL." });
  }
});

export default router;
