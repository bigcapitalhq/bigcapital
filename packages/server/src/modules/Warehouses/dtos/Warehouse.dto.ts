import { IsOptional } from "@/common/decorators/Validators";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsUrl } from "class-validator";
import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";


export class CommandWarehouseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the warehouse' })
  name: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Whether the warehouse is primary' })
  primary?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The code of the warehouse' })
  code?: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The address of the warehouse' })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The city of the warehouse' })
  city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The country of the warehouse' })
  country?: string;
  
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The phone number of the warehouse' })
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ description: 'The email of the warehouse' })
  email?: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({ description: 'The website of the warehouse' })
  website?: string;
}

export class CreateWarehouseDto extends CommandWarehouseDto {}
export class EditWarehouseDto extends CommandWarehouseDto {}