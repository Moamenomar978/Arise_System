import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateShopItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
