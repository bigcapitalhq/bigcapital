import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface LicenseValidationResponse {
  valid: boolean;
  expiresAt?: Date;
  features: string[];
  gracePeriodEndsAt?: Date;
}

@Injectable()
export class LicenseService {
  private cache: Map<string, { response: LicenseValidationResponse; timestamp: number }> = new Map();

  constructor(private readonly configService: ConfigService) {}

  async validateLicense(): Promise<LicenseValidationResponse> {
    const licenseKey = this.configService.get<string>('license.key');
    const cacheTtl = this.configService.get<number>('license.cacheTtl') || 3600;

    if (!licenseKey) {
      return {
        valid: false,
        features: [],
      };
    }

    const cached = this.cache.get(licenseKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < cacheTtl * 1000) {
      return cached.response;
    }

    const validation = await this.callLicenseAPI(licenseKey);
    this.cache.set(licenseKey, { response: validation, timestamp: now });

    return validation;
  }

  async isFeatureLicensed(feature: string): Promise<boolean> {
    const license = await this.validateLicense();

    if (!license.valid) {
      // Check if within grace period
      if (license.gracePeriodEndsAt && new Date() < license.gracePeriodEndsAt) {
        return license.features.includes(feature);
      }
      return false;
    }

    return license.features.includes(feature);
  }

  async verifyLicenseKey(licenseKey: string): Promise<boolean> {
    try {
      const validation = await this.callLicenseAPI(licenseKey);
      return validation.valid;
    } catch {
      return false;
    }
  }

  private async callLicenseAPI(key: string): Promise<LicenseValidationResponse> {
    const apiUrl = this.configService.get<string>('license.apiUrl');
    const gracePeriodDays = this.configService.get<number>('license.gracePeriodDays') || 7;

    try {
      // For now, implement a basic validation that accepts any non-empty key
      // In production, this should call your actual license server
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseKey: key }),
      });

      if (!response.ok) {
        throw new HttpException(
          'License validation failed',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      const data = await response.json();

      // Calculate grace period if license is expired
      let gracePeriodEndsAt: Date | undefined;
      if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
        gracePeriodEndsAt = new Date(
          new Date(data.expiresAt).getTime() + gracePeriodDays * 24 * 60 * 60 * 1000,
        );
      }

      return {
        valid: data.valid,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        features: data.features || [],
        gracePeriodEndsAt,
      };
    } catch (error) {
      // If the API call fails, fall back to a permissive mode for development
      // In production, you may want to return { valid: false, features: [] }
      if (process.env.NODE_ENV === 'development') {
        return {
          valid: true,
          features: ['workspaces'],
        };
      }

      return {
        valid: false,
        features: [],
      };
    }
  }
}
