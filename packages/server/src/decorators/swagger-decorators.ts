export const swaggerDocs = {
  tags: {},
  paths: {},
};

// Decorator to set a tag for a route
export function ApiTags(tag) {
  return function (target) {
    if (!swaggerDocs.tags[tag]) {
      swaggerDocs.tags[tag] = { name: tag };
    }
  };
}

// Decorator to add an operation for a specific route
export function ApiOperation(options) {
  return function (target, propertyKey, descriptor) {
    const routePath = Reflect.getMetadata('path', target, propertyKey);

    swaggerDocs.paths[routePath] = swaggerDocs.paths[routePath] || {};
    swaggerDocs.paths[routePath].get = {
      summary: options.summary,
      description: options.description || '',
      responses: options.responses || {
        200: {
          description: 'Successful Response',
        },
      },
    };

    
  };
}

// Decorator to define the route path
export function Route(path) {
  return function (target, propertyKey, descriptor) {
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

// Decorator to add a response schema for a specific route
export function ApiResponse(options) {
  return function (target, propertyKey, descriptor) {
    const routePath = Reflect.getMetadata('path', target, propertyKey);
    
    if (!swaggerDocs.paths[routePath]) {
      swaggerDocs.paths[routePath] = { get: {} };
    }

    swaggerDocs.paths[routePath].get.responses =
      swaggerDocs.paths[routePath].get.responses || {};

    swaggerDocs.paths[routePath].get.responses[options.status] = {
      description: options.description || 'No description provided',
      content: {
        'application/json': {
          schema: options.schema || {},
        },
      },
    };
  };
}
