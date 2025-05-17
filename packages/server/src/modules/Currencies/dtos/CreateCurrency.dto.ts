import { IsString } from 'class-validator';

export class CreateCurrencyDto  {
  @IsString()
  currencyName: string;  

  @IsString()
  currencyCode: string;

  @IsString()
  currencySign: string;
}
