import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService, ClsServiceManager } from 'nestjs-cls';

export class TenancyGlobalMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}
  /**
   * Validates the organization ID in the request headers.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public use(req: Request, res: Response, next: NextFunction) {
    const organizationId = req.headers['organization-id'];

    if (!organizationId) {
      throw new UnauthorizedException('Organization ID is required.');
    }
    next();
  }
}
