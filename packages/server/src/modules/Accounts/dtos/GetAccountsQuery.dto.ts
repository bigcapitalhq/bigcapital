import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';
import { IAccountsStructureType } from '../Accounts.types';

export class GetAccountsQueryDto {
  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter to show only inactive accounts',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  onlyInactive?: boolean;

  @ApiPropertyOptional({
    enum: IAccountsStructureType,
    description: 'Structure type for the accounts list',
    default: IAccountsStructureType.Tree,
  })
  @IsOptional()
  @IsEnum(IAccountsStructureType)
  structure?: IAccountsStructureType;
}

