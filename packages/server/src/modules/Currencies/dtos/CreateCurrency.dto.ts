import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";

export class CreateCurrencyDto  {
  @IsString()
  @IsNotEmpty()
  currencyName: string;  

  @IsString()
  @IsNotEmpty()
  currencyCode: string;

  @IsString()
  @IsNotEmpty()
  currencySign: string;
}
