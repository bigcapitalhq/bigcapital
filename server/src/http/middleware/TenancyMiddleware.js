import fs from 'fs';
import path from 'path';
import TenantsManager from '@/system/TenantsManager';
import Model from '@/models/Model';

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
  const { organization: organizationId } = req.query;
  const notFoundOrganization = () => res.status(400).send({
    errors: [{ type: 'ORGANIZATION.ID.NOT.FOUND' }],
  });

  if (!organizationId) {
    return notFoundOrganization();
  }
  const tenant = await TenantsManager.getTenant(organizationId);

  if (!tenant) {
    return notFoundOrganization();
  }
  const knex = TenantsManager.knexInstance(organizationId);
  const models = loadModelsFromDirectory();

  Model.knexBinded = knex;

  req.knex = knex;
  req.organizationId = organizationId;
  req.models = {
    ...Object.values(models).reduce((acc, model) => {
      if (model.resource
        && model.resource.default
        && Object.getPrototypeOf(model.resource.default) === Model) {
        acc[model.name] = model.resource.default.bindKnex(knex);
      }
      return acc;
    }, {}),
  };
  next();
};