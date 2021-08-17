import { Request, Response } from 'express';

const asyncRender = (app) => (path: string, attributes = {}) =>
  new Promise((resolve, reject) => {
    app.render(path, attributes, (error, data) => {
      if (error) { reject(error); }

      resolve(data);
    });
  });

/**
 * Injects `asyncRender` method to response object.
 * @param {Request} req Express req Object
 * @param {Response} res  Express res Object
 * @param {NextFunction} next  Express next Function
 */
const asyncRenderMiddleware = (req: Request, res: Response, next: Function) => {
  res.asyncRender = asyncRender(req.app);
  next();
};

export default asyncRenderMiddleware;
