import { Injectable } from '@nestjs/common';
import {
  assertExtensionCompatibility,
  parseExtensionManifest,
} from '@bigcapital/extension-sdk/manifest';
import type { BigcapitalExtension } from '@bigcapital/extension-sdk/server';
import { ExtensionValidationError } from './extension.errors';
import type { ValidatedExtension } from './extension.types';

/**
 * Parses, validates, and normalizes the extensions compiled into the host.
 *
 * Validation is intentionally fail-fast: a malformed manifest or an API version
 * mismatch is a build/deploy problem, not a runtime problem.
 */
export function validateExtensions(
  extensions: BigcapitalExtension[],
): ValidatedExtension[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  const validated: ValidatedExtension[] = [];

  extensions.forEach((extension, index) => {
    try {
      const manifest = parseExtensionManifest(extension.manifest);

      assertExtensionCompatibility(manifest);

      if (seen.has(manifest.id)) {
        issues.push(
          `Extension "${manifest.id}" is declared more than once (index ${index}).`,
        );
        return;
      }

      seen.add(manifest.id);
      validated.push({ ...extension, manifest });
    } catch (error) {
      issues.push(`Extension at index ${index}: ${(error as Error).message}`);
    }
  });

  if (issues.length > 0) {
    throw new ExtensionValidationError(issues);
  }

  return validated;
}

@Injectable()
export class ExtensionLoader {
  validate(extensions: BigcapitalExtension[]): ValidatedExtension[] {
    return validateExtensions(extensions);
  }
}
