import { Router } from 'express';

import { Container, Inject, Service } from 'typedi';
import BaseController from '../BaseController';

import RolesService from '@/services/Roles/RolesService';
import PermissionsSchema from './PermissionsSchema';
import RolesController from './Roles';
@Service()
export default class RolesBaseController extends BaseController {
  @Inject()
  rolesService: RolesService;

  router() {
    const router = Router();

    router.use('/', Container.get(PermissionsSchema).router());
    router.use('/', Container.get(RolesController).router());

    return router;
  }
}
