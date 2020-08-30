import fs from 'fs';
import path from 'path';
import TenantsManager from '@/system/TenantsManager';
import TenantModel from '@/models/TenantModel';
import { Container } from 'typedi';

function loadModelsFromDirectory() {
  const models = {};
  fs.readdirSync('src/models/').forEach((filename) => {
    const model = {
      path: path.join(__dirname, 'src/models/', filename),
      name: filename.replace(/\.[^/.]+$/, ''),
    };
    // eslint-disable-next-line global-require
    model.resource = require(`@/models/${model.name}`);
    models[model.name] = model;
  });
  return models;
}

export default async (req, res, next) => {
  const organizationId = req.headers['organization-id'] || req.query.organization;
  const notFoundOrganization = () => res.boom.unauthorized(
    'Organization identication not found.',
    { errors: [{ type: 'ORGANIZATION.ID.NOT.FOUND', code: 100 }] },
  );

  if (!organizationId) {
    return notFoundOrganization();
  }
  const tenant = await TenantsManager.getTenant(organizationId);

  // When the given organization id not found on the system storage.
  if (!tenant) {
    return notFoundOrganization();
  }
  // When user tenant not match the given organization id.
  if (tenant.id !== req.user.tenantId) {
    return res.boom.unauthorized();
  }
  const knex = TenantsManager.knexInstance(organizationId);
  const models = loadModelsFromDirectory();

  TenantModel.knexBinded = knex;

  req.knex = knex;
  req.organizationId = organizationId;
  req.tenant = tenant;
  req.tenantId = tenant.id;
  req.models = {
    ...Object.values(models).reduce((acc, model) => {      
      if (typeof model.resource.default !== 'undefined' &&
        typeof model.resource.default.requestModel === 'function' && 
        model.resource.default.requestModel() &&
        model.name !== 'TenantModel') {
        acc[model.name] = model.resource.default.bindKnex(knex);
      }
      return acc;
    }, {}),
  };
  Container.of(`tenant-${tenant.id}`).set('models', {
    ...req.models,
  });
  next();
};