import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LicenseService } from './License.service';

@ApiTags('License')
@Controller('license')
@ApiBearerAuth()
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get current license status' })
  async getLicenseStatus(): Promise<{
    valid: boolean;
    expiresAt?: Date;
    gracePeriodEndsAt?: Date;
    features: string[];
    daysUntilExpiry?: number;
  }> {
    const license = await this.licenseService.validateLicense();

    return {
      valid: license.valid,
      expiresAt: license.expiresAt,
      gracePeriodEndsAt: license.gracePeriodEndsAt,
      features: license.features,
      daysUntilExpiry: license.expiresAt
        ? Math.ceil(
            (license.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          )
        : undefined,
    };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify a license key (for testing)' })
  async verifyLicense(
    @Body() dto: { licenseKey: string },
  ): Promise<{
    valid: boolean;
    message: string;
  }> {
    const isValid = await this.licenseService.verifyLicenseKey(dto.licenseKey);
    return {
      valid: isValid,
      message: isValid
        ? 'License is valid'
        : 'License is invalid or expired',
    };
  }

  @Get('features/:feature')
  @ApiOperation({ summary: 'Check if a specific feature is licensed' })
  async checkFeature(
    @Param('feature') feature: string,
  ): Promise<{
    feature: string;
    licensed: boolean;
  }> {
    const licensed = await this.licenseService.isFeatureLicensed(feature);
    return { feature, licensed };
  }
}
