/* eslint-disable no-unused-vars */
import express from 'express';
import { check, validationResult } from 'express-validator';
import { difference } from 'lodash';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import Role from '@/models/Role';
import Permission from '@/models/Permission';
import Resource from '@/models/Resource';
import knex from '@/database/knex';

const AccessControllSchema = [
  {
    resource: 'items',
    label: 'products_services',
    permissions: ['create', 'edit', 'delete', 'view'],
    fullAccess: true,
    ownControl: true,
  },
];

const getResourceSchema = (resource) => AccessControllSchema
  .find((schema) => schema.resource === resource);

const getResourcePermissions = (resource) => {
  const foundResource = getResourceSchema(resource);
  return foundResource ? foundResource.permissions : [];
};

const findNotFoundResources = (resourcesSlugs) => {
  const schemaResourcesSlugs = AccessControllSchema.map((s) => s.resource);
  return difference(resourcesSlugs, schemaResourcesSlugs);
};

const findNotFoundPermissions = (permissions, resourceSlug) => {
  const schemaPermissions = getResourcePermissions(resourceSlug);
  return difference(permissions, schemaPermissions);
};

export default {
  /**
   * Router constructor method.
   */
  router() {
    const router = express.Router();

    router.post('/',
      this.newRole.validation,
      asyncMiddleware(this.newRole.handler));

    router.post('/:id',
      this.editRole.validation,
      asyncMiddleware(this.editRole.handler.bind(this)));

    router.delete('/:id',
      this.deleteRole.validation,
      asyncMiddleware(this.deleteRole.handler));

    return router;
  },

  /**
   * Creates a new role.
   */
  newRole: {
    validation: [
      check('name').exists().trim().escape(),
      check('description').optional().trim().escape(),
      check('permissions').isArray({ min: 0 }),
      check('permissions.*.resource_slug').exists().whitelist('^[a-z0-9]+(?:-[a-z0-9]+)*$'),
      check('permissions.*.permissions').isArray({ min: 1 }),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { name, description, permissions } = req.body;

      const resourcesSlugs = permissions.map((perm) => perm.resource_slug);
      const permissionsSlugs = [];
      const resourcesNotFound = findNotFoundResources(resourcesSlugs);

      const errorReasons = [];
      const notFoundPermissions = [];

      if (resourcesNotFound.length > 0) {
        errorReasons.push({
          type: 'RESOURCE_SLUG_NOT_FOUND', code: 100, resources: resourcesNotFound,
        });
      }
      permissions.forEach((perm) => {
        const abilities = perm.permissions.map((ability) => ability);

        // Gets the not found permissions in the schema.
        const notFoundAbilities = findNotFoundPermissions(abilities, perm.resource_slug);
        
        if (notFoundAbilities.length > 0) {
          notFoundPermissions.push({
            resource_slug: perm.resource_slug,
            permissions: notFoundAbilities,
          });
        } else {
          const perms = perm.permissions || [];
          perms.forEach((permission) => {
            if (perms.indexOf(permission) !== -1) {
              permissionsSlugs.push(permission);
            }
          });
        }
      });
      if (notFoundPermissions.length > 0) {
        errorReasons.push({
          type: 'PERMISSIONS_SLUG_NOT_FOUND',
          code: 200,
          permissions: notFoundPermissions,
        });
      }
      if (errorReasons.length > 0) {
        return res.boom.badRequest(null, { errors: errorReasons });
      }
      // Permissions.
      const [resourcesCollection, permsCollection] = await Promise.all([
        Resource.query((query) => { query.whereIn('name', resourcesSlugs); }).fetchAll(),
        Permission.query((query) => { query.whereIn('name', permissionsSlugs); }).fetchAll(),
      ]);

      const notStoredResources = difference(
        resourcesSlugs, resourcesCollection.map((s) => s.name),
      );
      const notStoredPermissions = difference(
        permissionsSlugs, permsCollection.map((perm) => perm.slug),
      );

      const insertThread = [];

      if (notStoredResources.length > 0) {
        insertThread.push(knex('resources').insert([
          ...notStoredResources.map((resource) => ({ name: resource })),
        ]));
      }
      if (notStoredPermissions.length > 0) {
        insertThread.push(knex('permissions').insert([
          ...notStoredPermissions.map((permission) => ({ name: permission })),
        ]));
      }

      await Promise.all(insertThread);

      const [storedPermissions, storedResources] = await Promise.all([
        Permission.query((q) => { q.whereIn('name', permissionsSlugs); }).fetchAll(),
        Resource.query((q) => { q.whereIn('name', resourcesSlugs); }).fetchAll(),
      ]);

      const storedResourcesSet = new Map(storedResources.map((resource) => [
        resource.attributes.name, resource.attributes.id,
      ]));
      const storedPermissionsSet = new Map(storedPermissions.map((perm) => [
        perm.attributes.name, perm.attributes.id,
      ]));
      const role = Role.forge({ name, description });

      await role.save();

      const roleHasPerms = permissions.map((resource) => resource.permissions.map((perm) => ({
        role_id: role.id,
        resource_id: storedResourcesSet.get(resource.resource_slug),
        permission_id: storedPermissionsSet.get(perm),
      })));

      if (roleHasPerms.length > 0) {
        await knex('role_has_permissions').insert(roleHasPerms[0]);
      }
      return res.status(200).send({ id: role.get('id') });
    },
  },

  /**
   * Edit the give role.
   */
  editRole: {
    validation: [
      check('name').exists().trim().escape(),
      check('description').optional().trim().escape(),
      check('permissions').isArray({ min: 0 }),
      check('permissions.*.resource_slug').exists().whitelist('^[a-z0-9]+(?:-[a-z0-9]+)*$'),
      check('permissions.*.permissions').isArray({ min: 1 }),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const { id } = req.params;
      const role = await Role.where('id', id).fetch();

      if (!role) {
        return res.boom.notFound(null, {
          errors: [{ type: 'ROLE_NOT_FOUND', code: 100 }],
        });
      }

      const { permissions } = req.body;
      const errorReasons = [];
      const permissionsSlugs = [];
      const notFoundPermissions = [];

      const resourcesSlugs = permissions.map((perm) => perm.resource_slug);
      const resourcesNotFound = findNotFoundResources(resourcesSlugs);

      if (resourcesNotFound.length > 0) {
        errorReasons.push({
          type: 'RESOURCE_SLUG_NOT_FOUND',
          code: 100,
          resources: resourcesNotFound,
        });
      }

      permissions.forEach((perm) => {
        const abilities = perm.permissions.map((ability) => ability);
        // Gets the not found permissions in the schema.
        const notFoundAbilities = findNotFoundPermissions(abilities, perm.resource_slug);

        if (notFoundAbilities.length > 0) {
          notFoundPermissions.push({
            resource_slug: perm.resource_slug, permissions: notFoundAbilities,
          });
        } else {
          const perms = perm.permissions || [];
          perms.forEach((permission) => {
            if (perms.indexOf(permission) !== -1) {
              permissionsSlugs.push(permission);
            }
          });
        }
      });

      if (notFoundPermissions.length > 0) {
        errorReasons.push({
          type: 'PERMISSIONS_SLUG_NOT_FOUND',
          code: 200,
          permissions: notFoundPermissions,
        });
      }
      if (errorReasons.length > 0) {
        return res.boom.badRequest(null, { errors: errorReasons });
      }

      // Permissions.
      const [resourcesCollection, permsCollection] = await Promise.all([
        Resource.query((query) => { query.whereIn('name', resourcesSlugs); }).fetchAll(),
        Permission.query((query) => { query.whereIn('name', permissionsSlugs); }).fetchAll(),
      ]);

      const notStoredResources = difference(
        resourcesSlugs, resourcesCollection.map((s) => s.name),
      );
      const notStoredPermissions = difference(
        permissionsSlugs, permsCollection.map((perm) => perm.slug),
      );
      const insertThread = [];

      if (notStoredResources.length > 0) {
        insertThread.push(knex('resources').insert([
          ...notStoredResources.map((resource) => ({ name: resource })),
        ]));
      }
      if (notStoredPermissions.length > 0) {
        insertThread.push(knex('permissions').insert([
          ...notStoredPermissions.map((permission) => ({ name: permission })),
        ]));
      }

      await Promise.all(insertThread);

      const [storedPermissions, storedResources] = await Promise.all([
        Permission.query((q) => { q.whereIn('name', permissionsSlugs); }).fetchAll(),
        Resource.query((q) => { q.whereIn('name', resourcesSlugs); }).fetchAll(),
      ]);

      const storedResourcesSet = new Map(storedResources.map((resource) => [
        resource.attributes.name, resource.attributes.id,
      ]));
      const storedPermissionsSet = new Map(storedPermissions.map((perm) => [
        perm.attributes.name, perm.attributes.id,
      ]));

      await role.save();


      const savedRoleHasPerms = await knex('role_has_permissions').where({
        role_id: role.id,
      });

      console.log(savedRoleHasPerms);

      // const roleHasPerms = permissions.map((resource) => resource.permissions.map((perm) => ({
      //   role_id: role.id,
      //   resource_id: storedResourcesSet.get(resource.resource_slug),
      //   permission_id: storedPermissionsSet.get(perm),
      // })));

      // if (roleHasPerms.length > 0) {
      //   await knex('role_has_permissions').insert(roleHasPerms[0]);
      // }
      return res.status(200).send({ id: role.get('id') });
    },
  },

  deleteRole: {
    validation: [],
    async handler(req, res) {
      const { id } = req.params;
      const role = await Role.where('id', id).fetch();

      if (!role) {
        return res.boom.notFound();
      }
      if (role.attributes.predefined) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ROLE_PREDEFINED', code: 100 }],
        });
      }

      await knex('role_has_permissions')
        .where('role_id', role.id).delete({ require: false });

      await role.destroy();

      return res.status(200).send();
    },
  },

  getRole: {
    validation: [],
    handler(req, res) {
      return res.status(200).send();
    },
  },
};
