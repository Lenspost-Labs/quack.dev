import PinataClient from "@pinata/sdk";
const pinata = new PinataClient({
  pinataJWTKey: process.env.PINATA_JWT_KEY,
});

export default pinata;
