import { cookies } from "next/headers";
import crypto from "crypto";

import {
  AUTH_SECRET,
  SESSION_COOKIE,
  SESSION_DAYS,
} from "@/lib/auth/constants";

type SessionPayload = {
  sub: string;
  role: string;
  exp: number;
};

const base64url = (input: Buffer | string) =>
  (typeof input === "string" ? Buffer.from(input, "utf8") : input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const requireSecret = () => {
  if (!AUTH_SECRET) {
    throw new Error("AUTH_SECRET env variable is required for admin sessions.");
  }
  return AUTH_SECRET;
};

const sign = (payload: SessionPayload) => {
  const secret = requireSecret();
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(payload));
  const data = `${headerB64}.${payloadB64}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${data}.${signature}`;
};

const verify = (token: string): SessionPayload | null => {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signature] = parts;
  const data = `${headerB64}.${payloadB64}`;
  const secret = AUTH_SECRET;
  if (!secret) return null;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  if (expected !== signature) return null;

  try {
    // @ts-expect-error runtime env ensures secret is string
    const payloadJson = Buffer.from(payloadB64, "base64").toString("utf8");
    const payload = JSON.parse(payloadJson) as SessionPayload;
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

export const createSessionToken = (userId: string, role: string) => {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 24 * 60 * 60;
  return sign({ sub: userId, role, exp });
};

export const verifySessionToken = (token: string) => verify(token);

export const setSessionCookie = async (token: string) => {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: "/",
  });
};

export const clearSessionCookie = async () => {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
};

export const getSessionFromCookies =
  async (): Promise<SessionPayload | null> => {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  };

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
