import { IsString, IsOptional } from 'class-validator';

export class AskParamsDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  project?: string;
}
