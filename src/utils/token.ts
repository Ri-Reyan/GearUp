import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const generateToken = (
  payload: string | JwtPayload | object,
  secret: Secret,
  time: string,
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: time as SignOptions["expiresIn"],
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload | string => {
  return jwt.verify(token, secret);
};

export const token = {
  generateToken,
  verifyToken,
};
