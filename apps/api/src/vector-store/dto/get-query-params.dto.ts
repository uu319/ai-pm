import { IsString, IsOptional } from 'class-validator';

export class GetQueryParamsDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  project?: string;
}
