import { AUTH_SECRET } from "@/lib/auth/constants";

type SessionPayload = {
  sub: string;
  role: string;
  exp: number;
};

const base64urlToUint8 = (input: string) => {
  const pad = "=".repeat((4 - (input.length % 4)) % 4);
  const base64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
};

const uint8ToString = (bytes: Uint8Array) => new TextDecoder().decode(bytes);

export const verifySessionTokenEdge = async (
  token: string
): Promise<SessionPayload | null> => {
  const secret = AUTH_SECRET;
  if (!secret) return null;
  const keySecret: string = secret;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(keySecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const data = `${headerB64}.${payloadB64}`;
  const verified = await crypto.subtle.verify(
    "HMAC",
    key,
    // @ts-expect-error runtime-provided secret may be undefined during build-time analysis
    base64urlToUint8(signatureB64),
    encoder.encode(data)
  );

  if (!verified) return null;

  try {
    const payload = JSON.parse(
      // @ts-expect-error runtime-provided secret may be undefined during build-time analysis
      uint8ToString(base64urlToUint8(payloadB64))
    ) as SessionPayload;
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};
