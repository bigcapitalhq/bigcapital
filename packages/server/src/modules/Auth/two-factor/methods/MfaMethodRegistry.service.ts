import { Injectable } from '@nestjs/common';
import { TwoFactorMethodUnavailableException } from '../TwoFactor.exceptions';
import { RecoveryCodeMfaMethod } from './RecoveryCodeMfaMethod';
import { TotpMfaMethod } from './TotpMfaMethod';
import type {
  MfaMethodDescriptor,
  MfaMethodId,
  MfaMethodProvider,
} from './MfaMethod.types';

/**
 * The single place that knows the available second-factor methods.
 * Adding a method means implementing `MfaMethodProvider`, registering it here,
 * and adding its setup/verify component in the webapp.
 */
@Injectable()
export class MfaMethodRegistry {
  private readonly providers = new Map<MfaMethodId, MfaMethodProvider>();

  constructor(totp: TotpMfaMethod, recoveryCode: RecoveryCodeMfaMethod) {
    for (const provider of [totp, recoveryCode]) {
      this.providers.set(provider.id, provider);
    }
  }

  /**
   * A provider by method id, or undefined for an unknown method.
   */
  public get(methodId: string): MfaMethodProvider | undefined {
    return this.providers.get(methodId as MfaMethodId);
  }

  /**
   * A provider by method id; throws when the method does not exist.
   */
  public require(methodId: string): MfaMethodProvider {
    const provider = this.get(methodId);

    if (!provider) {
      throw new TwoFactorMethodUnavailableException();
    }
    return provider;
  }

  /**
   * The methods the user can verify with, in display order.
   */
  public async getEnrolledMethods(
    userId: number,
  ): Promise<MfaMethodDescriptor[]> {
    const enrolled = await Promise.all(
      [...this.providers.values()].map(async (provider) => ({
        provider,
        enrolled: await provider.isEnrolled(userId),
      })),
    );
    return enrolled
      .filter(({ enrolled }) => enrolled)
      .map(({ provider }) => this.describe(provider));
  }

  /**
   * The methods a user can set up during sign-in.
   */
  public getEnrollableMethods(): MfaMethodDescriptor[] {
    return [...this.providers.values()]
      .filter((provider) => !!provider.startSetup)
      .map((provider) => this.describe(provider));
  }

  /**
   * Whether the user has at least one method, used by the enforcement guard.
   */
  public async hasAnyEnrolled(userId: number): Promise<boolean> {
    for (const provider of this.providers.values()) {
      if (await provider.isEnrolled(userId)) {
        return true;
      }
    }
    return false;
  }

  private describe(provider: MfaMethodProvider): MfaMethodDescriptor {
    return { id: provider.id, kind: provider.kind };
  }
}
