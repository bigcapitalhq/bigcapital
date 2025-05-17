import { IsString } from 'class-validator';

export class EditCurrencyDto {
  @IsString()
  currencyName: string;

  @IsString()
  currencySign: string;
}
