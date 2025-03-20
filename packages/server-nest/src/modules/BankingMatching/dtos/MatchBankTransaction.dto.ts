import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MatchTransactionEntryDto {
  @IsString()
  @IsNotEmpty()
  referenceType: string;

  @IsNumber()
  @IsNotEmpty()
  referenceId: number;
}

export class MatchBankTransactionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchTransactionEntryDto)
  entries: MatchTransactionEntryDto[];
}
