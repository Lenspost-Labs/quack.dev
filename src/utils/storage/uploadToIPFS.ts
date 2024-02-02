import storage from "../clients/storage";

const uploadToIPFS = async (data: Object) => {

  const cid = await storage.pinJSONToIPFS(data);
  return cid.IpfsHash;
};

export default uploadToIPFS;
