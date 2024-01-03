import { IsString } from 'class-validator';
import { NotionAPIType } from 'langchain/document_loaders/web/notionapi';

export class NotionSaveToVectorStoreParamsDto {
  @IsString()
  notionPageOrDatabaseId: string;

  @IsString()
  type: NotionAPIType;
}
