import { IsString, IsOptional } from 'class-validator';

export class NotionSearchParamsDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  project?: string;
}
