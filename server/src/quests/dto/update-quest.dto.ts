import { IsString, IsNumber, IsIn, IsOptional, IsBoolean, Min, MaxLength } from 'class-validator';

export class UpdateQuestDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['daily', 'weekly', 'main', 'special'])
  type?: string;

  @IsOptional()
  @IsString()
  @IsIn(['E', 'D', 'C', 'B', 'A', 'S'])
  rank?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  targetAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rewardXp?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rewardGold?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
