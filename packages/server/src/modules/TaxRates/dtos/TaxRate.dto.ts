import { ToNumber } from '@/common/decorators/Validators';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CommandTaxRateDto {
  /**
   * Tax rate name.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the tax rate.', example: 'VAT' })
  name: string;

  /**
   * Tax rate code.
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The code of the tax rate.', example: 'VAT' })
  code: string;

  /**
   * Tax rate percentage.
   */
  @IsNumber()
  @IsNotEmpty()
  @ToNumber()
  @ApiProperty({
    description: 'The rate of the tax rate.',
    example: 10,
  })
  rate: number;

  /**
   * Tax rate description.
   */
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The description of the tax rate.',
    example: 'VAT',
  })
  description?: string;

  /**
   * Whether the tax is non-recoverable.
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value ?? false)
  @ApiProperty({
    description: 'Whether the tax is non-recoverable.',
    example: false,
  })
  isNonRecoverable?: boolean;

  /**
   * Whether the tax is compound.
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value ?? false)
  @ApiProperty({
    description: 'Whether the tax is compound.',
    example: false,
  })
  isCompound?: boolean;

  /**
   * Whether the tax rate is active.
   */
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value ?? false)
  @ApiProperty({
    description: 'Whether the tax rate is active.',
    example: false,
  })
  active?: boolean;
}

export class CreateTaxRateDto extends CommandTaxRateDto {}
export class EditTaxRateDto extends CommandTaxRateDto {}
