/**
 * Raised when one or more extension manifests fail validation.
 */
export class ExtensionValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(
      [
        'Extension validation failed:',
        ...issues.map((issue) => `  - ${issue}`),
      ].join('\n'),
    );
    this.name = 'ExtensionValidationError';
  }
}

export class ExtensionNotFoundError extends Error {
  constructor(public readonly extensionId: string) {
    super(`Extension "${extensionId}" is not installed.`);
    this.name = 'ExtensionNotFoundError';
  }
}

export class ExtensionTenantNotFoundError extends Error {
  constructor(
    public readonly extensionId: string,
    public readonly organizationId: string,
  ) {
    super(
      `Extension "${extensionId}" is not configured for organization "${organizationId}".`,
    );
    this.name = 'ExtensionTenantNotFoundError';
  }
}

export class ExtensionCapabilityError extends Error {
  constructor(
    public readonly extensionId: string,
    public readonly capability: string,
  ) {
    super(
      `Extension "${extensionId}" did not declare the "${capability}" capability.`,
    );
    this.name = 'ExtensionCapabilityError';
  }
}
