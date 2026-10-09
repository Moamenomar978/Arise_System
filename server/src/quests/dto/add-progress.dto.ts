import { IsNumber, Min } from 'class-validator';

export class AddProgressDto {
  @IsNumber()
  @Min(1)
  amount: number;
}
