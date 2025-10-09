"use server";
import { SignJWT, jwtVerify } from "jose";
import { checkEnvExistence } from "./helpers";
import { cookies } from "next/headers";

const secretKey = checkEnvExistence("JWT_SECRET");
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayLoad = {
  username: string;
  expiresAt: Date;
};

export const createSession = async (username: string) => {
  const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ username, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
};

export const encrypt = async (payload: SessionPayLoad) => {
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
    //console.error("Failed to verify session", error);
  }
};
