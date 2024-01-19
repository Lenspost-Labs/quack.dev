import { sign } from "jsonwebtoken";

export const generateJWT = (payload: object) => {
  return sign(payload, process.env.JWT_SECRET_KEY as string, { expiresIn: '1d' });
};
