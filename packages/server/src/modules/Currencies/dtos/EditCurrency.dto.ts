import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";

export class EditCurrencyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'USD', description: 'The currency name' })
  currencyName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '$', description: 'The currency sign' })
  currencySign: string;
}
