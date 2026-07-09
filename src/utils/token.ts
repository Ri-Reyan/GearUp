import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { IJwtPayload } from "../auth/auth.interface.js";

const generateToken = (
  payload: string | JwtPayload | object,
  secret: Secret,
  time: string,
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: time as SignOptions["expiresIn"],
  });
};

const verifyToken = (token: string, secret: Secret) => {
  const decode = jwt.verify(token, secret) as IJwtPayload;

  return decode;
};

export const token = {
  generateToken,
  verifyToken,
};
