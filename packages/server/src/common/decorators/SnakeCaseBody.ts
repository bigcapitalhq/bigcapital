import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Recursively adds a camelCase alias next to every snake_case key, keeping the
 * original key in place. Additive only — nothing is removed.
 */
export function addCamelCaseAliases<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => addCamelCaseAliases(item)) as unknown as T;
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }
  const source = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(source)) {
    const aliased = addCamelCaseAliases(source[key]);
    result[key] = aliased;

    if (key.includes('_') && !key.startsWith('_')) {
      const camelKey = key.replace(/_+([a-z0-9])/g, (_m, char: string) =>
        char.toUpperCase(),
      );
      if (camelKey !== key && !(camelKey in source)) {
        result[camelKey] = aliased;
      }
    }
  }
  return result as T;
}

/**
 * Drop-in replacement for `@Body()` for routes whose DTO declares camelCase
 * properties but whose real callers send snake_case.
 *
 * The webapp and `@bigcapital/sdk-ts` serialise request bodies to snake_case
 * (the SDK's snake-case request middleware; the API responds in snake_case
 * too). `class-transformer` maps by exact key name, so camelCase DTO
 * properties stay `undefined` and are then dropped by the global
 * `ValidationPipe`'s `whitelist: true` — e.g. `PUT /api/organization` used to
 * answer `200` while persisting nothing.
 *
 * This decorator runs before the pipes, so it hands the pipeline a body that
 * carries both the original snake_case keys and their camelCase aliases;
 * callers that already send camelCase are unaffected, and the surplus keys are
 * stripped by the whitelist.
 */
export const SnakeCaseBody = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return addCamelCaseAliases(request.body);
  },
);
