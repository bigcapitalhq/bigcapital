import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";

export class EditCurrencyDto {
  @IsString()
  @IsNotEmpty()
  currencyName: string;

  @IsString()
  @IsNotEmpty()
  currencySign: string;
}
