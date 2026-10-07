import { IsString, IsNumber, IsIn, IsOptional, IsBoolean, Min, MaxLength } from 'class-validator';

export class CreateQuestDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsString()
  @IsIn(['daily', 'weekly', 'main', 'special'])
  type: string;

  @IsOptional()
  @IsString()
  @IsIn(['E', 'D', 'C', 'B', 'A', 'S'])
  rank?: string;

  @IsNumber()
  @Min(1)
  targetAmount: number;

  @IsNumber()
  @Min(0)
  rewardXp: number;

  @IsNumber()
  @Min(0)
  rewardGold: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
