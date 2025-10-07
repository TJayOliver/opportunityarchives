import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { checkEnvExistence } from "./helpers";

const secretKey = checkEnvExistence("JWT_SECRET");
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayLoad = {
  userId: string;
  expiresAt: Date;
};

export const encrypt = (payload: SessionPayLoad) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(encodedKey);
};

export const decrypt = async (session: string | undefined = "") => {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error: unknown) {
    console.error("Failed to verify session", error);
  }
};
