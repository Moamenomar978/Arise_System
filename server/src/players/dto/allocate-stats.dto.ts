import { IsNumber, Min } from 'class-validator';

export class AllocateStatsDto {
  @IsNumber()
  @Min(0)
  strength: number = 0;

  @IsNumber()
  @Min(0)
  agility: number = 0;

  @IsNumber()
  @Min(0)
  intelligence: number = 0;

  @IsNumber()
  @Min(0)
  perception: number = 0;

  @IsNumber()
  @Min(0)
  vitality: number = 0;
}
