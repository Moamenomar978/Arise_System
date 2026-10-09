import { IsString, IsNumber, IsOptional, IsIn, Min } from 'class-validator';

export class CreateShopItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsIn(['heal', 'xp', 'statpoint', 'pardon', 'streakfreeze', 'none'])
  effectType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  effectValue?: number;
}
