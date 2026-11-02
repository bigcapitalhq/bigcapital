import 'reflect-metadata';
import { PATH_METADATA } from '@nestjs/common/constants';
import {
  EXTENSION_CONTROLLER_METADATA_KEY,
  type ExtensionControllerMetadata,
} from '@bigcapital/extension-sdk/server';
import type { ValidatedExtension } from './extension.types';

export interface DiscoveredController {
  metatype?: { name: string };
}

/**
 * Rejects extension controllers that are not mounted under
 * `/api/ext/<extensionId>`.
 *
 * Controllers must opt in with `@ExtensionController(...)`. Core controllers
 * are ignored.
 */
export function validateExtensionControllers(
  controllers: DiscoveredController[],
  extensions: ValidatedExtension[],
): void {
  const extensionIds = new Set(
    extensions.map((extension) => extension.manifest.id),
  );

  for (const controller of controllers) {
    const metatype = controller.metatype;

    if (!metatype) {
      continue;
    }

    const declaredPaths = Reflect.getMetadata(PATH_METADATA, metatype) as
      | string
      | string[]
      | undefined;

    const paths = Array.isArray(declaredPaths)
      ? declaredPaths
      : [declaredPaths ?? ''];

    const metadata = Reflect.getMetadata(
      EXTENSION_CONTROLLER_METADATA_KEY,
      metatype,
    ) as ExtensionControllerMetadata | undefined;

    if (!metadata) {
      if (paths.some((path) => path === 'ext' || path.startsWith('ext/'))) {
        throw new Error(
          `Controller "${metatype.name}" is mounted under "ext/..." but does not use @ExtensionController. Use the decorator so the host can enforce the extension namespace and enablement.`,
        );
      }

      continue;
    }

    if (!extensionIds.has(metadata.extensionId)) {
      throw new Error(
        `Controller "${metatype.name}" declares unknown extension "${metadata.extensionId}".`,
      );
    }

    const basePath = `ext/${metadata.extensionId}`;

    for (const path of paths) {
      if (path !== basePath && !path.startsWith(`${basePath}/`)) {
        throw new Error(
          `Controller "${metatype.name}" must be mounted under "${basePath}". Received "${path}". Use @ExtensionController("${metadata.extensionId}") instead of @Controller.`,
        );
      }
    }
  }
}
