import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'auto-webibi-jwt-secret-fallback-at-least-32-chars';

export interface SessionPayload {
  phoneNumber: string;
  role: 'admin' | 'agent';
}

export function signToken(payload: SessionPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days expiration
  })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
    
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) return null;
    
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    
    return {
      phoneNumber: payload.phoneNumber,
      role: payload.role
    };
  } catch (error) {
    return null;
  }
}

export function getSessionFromRequest(req: Request): SessionPayload | null {
  try {
    // 1. Check Authorization header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const session = verifyToken(token);
      if (session) return session;
    }
    
    // 2. Check Cookie header
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)session_token=([^;]+)/);
      if (match) {
        return verifyToken(match[1]);
      }
    }
  } catch (error) {
    console.error("Error reading session from request:", error);
  }
  return null;
}
