import cors from 'cors';
import config from '@/config';

const corsMiddleware = cors({
  origin: function (origin, callback) {
    const allowedDomains = config.cors.whitelistedDomains;

    const requestOrigin = origin?.endsWith('/') ? origin?.slice(0, -1) : origin;

    if (allowedDomains.indexOf(requestOrigin) !== -1 || !requestOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
});

export default corsMiddleware;
