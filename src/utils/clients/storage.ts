const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
import { v4 as uuidv4 } from "uuid";
// import { create } from 'ipfs-http-client';

const storage = async () => {
  const { create } = await import("ipfs-core");

  const ipfsClient =await create({});

  return ipfsClient;
};

// const storage = async () => {
//   const helia = await createHelia();
//   const j = json(helia);
//   return j;
// };

export default storage;
