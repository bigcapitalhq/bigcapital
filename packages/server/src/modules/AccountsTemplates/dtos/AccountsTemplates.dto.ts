import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import {
  AccountsTemplateChangeAction,
  AccountsTemplateIssueType,
} from '../AccountsTemplates.types';

export class AccountsTemplateVariantQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      'Variant of the template, e.g. the legal structure. Defaults to the first variant.',
    example: 'corporation',
  })
  variant?: string;
}

export class ApplyAccountsTemplateDto extends AccountsTemplateVariantQueryDto {}

export class AccountsTemplateVariantDto {
  @ApiProperty({ example: 'corporation' })
  key: string;

  @ApiProperty({ example: 'Corporation (S corporation or C corporation)' })
  name: string;

  @ApiPropertyOptional()
  description?: string;
}

export class AccountsTemplateDto {
  @ApiProperty({ example: 'united-states' })
  key: string;

  @ApiProperty({ example: 'United States' })
  name: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional({
    description: 'ISO 3166-1 alpha-2 country code',
    example: 'US',
  })
  country?: string;

  @ApiProperty({ type: () => AccountsTemplateVariantDto, isArray: true })
  variants: AccountsTemplateVariantDto[];
}

export class AccountsTemplateChangeSideDto {
  @ApiProperty({ nullable: true, example: '1010' })
  code: string | null;

  @ApiProperty({ example: 'Business Checking' })
  name: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ nullable: true })
  parentName: string | null;
}

export class AccountsTemplateChangeDto {
  @ApiProperty({ enum: AccountsTemplateChangeAction })
  action: AccountsTemplateChangeAction;

  @ApiProperty({
    nullable: true,
    description: 'Null for an account the template would create',
  })
  accountId: number | null;

  @ApiProperty({ example: 'bank' })
  accountType: string;

  @ApiProperty({ nullable: true })
  templateCode: string | null;

  @ApiProperty({ nullable: true })
  parentTemplateCode: string | null;

  @ApiProperty({ type: () => AccountsTemplateChangeSideDto, nullable: true })
  before: AccountsTemplateChangeSideDto | null;

  @ApiProperty({ type: () => AccountsTemplateChangeSideDto, nullable: true })
  after: AccountsTemplateChangeSideDto | null;
}

export class AccountsTemplateIssueDto {
  @ApiProperty({ enum: AccountsTemplateIssueType })
  type: AccountsTemplateIssueType;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional({ nullable: true })
  code?: string | null;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  accountId?: number;
}

export class AccountsTemplatePlanSummaryDto {
  @ApiProperty()
  update: number;

  @ApiProperty()
  create: number;

  @ApiProperty()
  remove: number;

  @ApiProperty()
  unchanged: number;

  @ApiProperty()
  skipped: number;
}

export class AccountsTemplatePlanDto {
  @ApiProperty({ example: 'united-states' })
  templateKey: string;

  @ApiProperty({ nullable: true, example: 'corporation' })
  variantKey: string | null;

  @ApiProperty({ type: () => AccountsTemplateChangeDto, isArray: true })
  changes: AccountsTemplateChangeDto[];

  @ApiProperty({
    type: () => AccountsTemplateIssueDto,
    isArray: true,
    description: 'Entries skipped; the rest of the template still applies',
  })
  warnings: AccountsTemplateIssueDto[];

  @ApiProperty({
    type: () => AccountsTemplateIssueDto,
    isArray: true,
    description: 'Conflicts that block applying the template',
  })
  errors: AccountsTemplateIssueDto[];

  @ApiProperty({ type: () => AccountsTemplatePlanSummaryDto })
  summary: AccountsTemplatePlanSummaryDto;
}
