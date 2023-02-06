import { Router, Request, Response } from 'express';

export default class Ping {
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      this.ping,
    );
    return router;
  }

  /**
   * Handle the ping request.
   * @param {Request} req 
   * @param {Response} res 
   */
  async ping(req: Request, res: Response)
  {
    return res.status(200).send({
      server: true,
    });
  }
}