import { Router } from "express";
import imagekit from "../../utils/clients/imagekit";
import axios from "axios";
import cheerio from "cheerio";
const router = Router();

router.get("/image", async (req, res) => {
  res.send(imagekit.getAuthenticationParameters());
});

router.get('/fetch-og', async (req, res) => {
  const url = req.query.url as string;

  if (!url) {
      return res.status(400).send({ error: 'URL query parameter is required.' });
  }

  try {
      const { data } = await axios.get<string>(url);
      const $ = cheerio.load(data);
      const ogTags: { [key: string]: string } = {};

      $('meta').each((_, element) => {
          const property = $(element).attr('property');
          const content = $(element).attr('content');

          console.log(property, content);

          if (property && (property.includes('og:') || property?.includes('fc:')) && content) {
              ogTags[property] = content;
          }
      });

      res.json(ogTags);
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to fetch or parse the URL.' });
  }
});

export default router;