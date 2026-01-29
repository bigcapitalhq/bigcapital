import { Request, Response, NextFunction } from 'express';

/**
 * Creates Express middleware for the Bull Board UI:
 * - When disabled: responds with 404.
 * - When enabled and username/password are set: enforces HTTP Basic Auth (401 if invalid).
 * - When enabled and credentials are not set: allows access (no auth).
 */
export function createBullBoardAuthMiddleware(
  enabled: boolean,
  username: string | undefined,
  password: string | undefined,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!enabled) {
      res.status(404).send('Not Found');
      return;
    }

    if (!username || !password) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Bull Board"');
      res.status(401).send('Authentication required');
      return;
    }

    const base64Credentials = authHeader.slice(6);
    let decoded: string;
    try {
      decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
    } catch {
      res.setHeader('WWW-Authenticate', 'Basic realm="Bull Board"');
      res.status(401).send('Invalid credentials');
      return;
    }

    const colonIndex = decoded.indexOf(':');
    if (colonIndex === -1) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Bull Board"');
      res.status(401).send('Invalid credentials');
      return;
    }

    const reqUsername = decoded.slice(0, colonIndex);
    const reqPassword = decoded.slice(colonIndex + 1);

    if (reqUsername !== username || reqPassword !== password) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Bull Board"');
      res.status(401).send('Invalid credentials');
      return;
    }

    next();
  };
}
