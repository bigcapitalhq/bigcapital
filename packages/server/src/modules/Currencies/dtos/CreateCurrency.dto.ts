import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";

export class CreateCurrencyDto  {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'USD', description: 'The currency name' })
  currencyName: string;  

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'USD', description: 'The currency code' })
  currencyCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '$', description: 'The currency sign' })
  currencySign: string;
}
