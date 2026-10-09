import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsIn(['easy', 'medium', 'hard', 'epic'])
  difficulty: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(150, { each: true })
  steps: string[];
}

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsIn(['easy', 'medium', 'hard', 'epic'])
  difficulty?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}

export class AddStepDto {
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  title: string;
}
