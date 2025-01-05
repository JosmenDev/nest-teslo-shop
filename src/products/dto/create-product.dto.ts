import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';
export class CreateProductDto {

  @ApiProperty({
    description: 'Product title (unique)',
    nullable: false,
    minLength: 1
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  // each is true quiere decir que cada elemento del arreglo tiene que ser un string
  @ApiProperty()
  @IsString({ each: true})
  @IsArray()
  @ArrayNotEmpty()
  sizes: string[];

  @ApiProperty()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty()
  @IsString({each: true})
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty()
  @IsString({each: true})
  @IsArray()
  @IsOptional()
  images?: string[]
}
