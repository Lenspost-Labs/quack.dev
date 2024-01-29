import storage from "../clients/storage";

const uploadToIPFS = async (data: Object) => {
  const client = await storage();
  const cid = await client.add(JSON.stringify(data));
  return cid;
};

export default uploadToIPFS;
