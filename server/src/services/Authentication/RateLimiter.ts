import { RateLimiterClusterMasterPM2, RateLimiterMemory, RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';

export default class RateLimiter {
  rateLimiter: RateLimiterRedis;

   /**
   * Rate limiter redis constructor.
   * @param {RateLimiterRedis} rateLimiter 
   */
  constructor(rateLimiter: RateLimiterMemory) {
    this.rateLimiter = rateLimiter;
  }

  /**
   * 
   * @return {boolean}
   */
  public attempt(key: string, pointsToConsume = 1): Promise<RateLimiterRes> {
    return this.rateLimiter.consume(key, pointsToConsume);
  }

  /**
   * Increment the counter for a given key for a given decay time.
   * @param {string} key -
   */
  public hit(
    key: string | number,
    points: number,
    secDuration: number,
  ): Promise<RateLimiterRes> {
    return this.rateLimiter.penalty(key, points, secDuration);
  }

  /**
   * Retrieve the rate limiter response of the given key.
   * @param {string} key 
   */
  public get(key: string): Promise<RateLimiterRes> {
    return this.rateLimiter.get(key);
  }

  /**
   * Resets the rate limiter of the given key.
   * @param key 
   */
  public reset(key: string): Promise<boolean> {
    return this.rateLimiter.delete(key);
  }
}