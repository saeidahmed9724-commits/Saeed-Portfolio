import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const IS_PROD = process.env.NODE_ENV === "production";
const DEV_SECRET = "saeed-portfolio-dev-session-secret-change-me";
const DEV_EMAIL = "saeed@saeedahmed.design";
const DEV_PASSWORD = "portfolio2026";

export const SESSION_COOKIE = "saeed_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function cfg() {
  return {
    email: process.env.ADMIN_EMAIL || (IS_PROD ? "" : DEV_EMAIL),
    password: process.env.ADMIN_PASSWORD || (IS_PROD ? "" : DEV_PASSWORD),
    secret: process.env.ADMIN_SESSION_SECRET || (IS_PROD ? "" : DEV_SECRET),
  };
}

/** In production, refuse to run admin routes with default/missing credentials. */
export function requireConfigured(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  const c = cfg();
  if (!c.email || !c.password || c.secret.length < 16) {
    res.status(500).json({
      error:
        "Admin is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET (16+ chars).",
    });
    return;
  }
  next();
}

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function credentialsValid(email: string, password: string): boolean {
  const c = cfg();
  const emailOk = safeEqual(email.toLowerCase(), c.email.toLowerCase());
  const passOk = safeEqual(password, c.password);
  return emailOk && passOk;
}

export function adminEmail(): string {
  return cfg().email;
}

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", cfg().secret)
    .update(payload)
    .digest("base64url");
}

export function signSession(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ email, iat: Date.now() }),
    "utf8"
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifySession(token: string | undefined): { email: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = sign(payload);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { email?: string; iat?: number };
    if (!parsed.email || typeof parsed.iat !== "number") return null;
    if (Date.now() - parsed.iat > SESSION_MAX_AGE_SECONDS * 1000) return null;
    return { email: parsed.email };
  } catch {
    return null;
  }
}

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    try {
      out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
    } catch {
      // ignore malformed cookie
    }
  }
  return out;
}

export function getSession(req: Request): { email: string } | null {
  return verifySession(parseCookies(req.headers.cookie)[SESSION_COOKIE]);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!getSession(req)) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }
  next();
}

const cookieFlags = () =>
  `Path=/; HttpOnly; SameSite=Lax${IS_PROD ? "; Secure" : ""}`;

export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; ${cookieFlags()}; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

export function clearedSessionCookie(): string {
  return `${SESSION_COOKIE}=; ${cookieFlags()}; Max-Age=0`;
}
