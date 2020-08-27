import { Request, Response } from 'express';
import { Container } from 'typedi';

export default async (req: Request, res: Response, next: Function) => {
  const { organizationId, knex } = req;

  if (!organizationId || !knex) {
    throw new Error('Should load `TenancyMiddleware` before this middleware.');
  }
  Container.of(`tenant-${organizationId}`).set('knex', knex);

  next();
};