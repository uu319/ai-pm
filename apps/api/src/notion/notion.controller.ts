import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { NotionService } from './notion.service';
import { NOTION_APP } from '../common/constants';
import { NotionSearchParamsDto } from './dto/notion-search-params.dto';
import { NotionSaveToVectorStoreParamsDto } from './dto/notion-save-to-vector-store-params';

@Controller('notion')
export class NotionController {
  constructor(
    @Inject(NOTION_APP) private readonly notionService: NotionService
  ) {}

  @Get('/search')
  search(@Query() query: NotionSearchParamsDto) {
    return this.notionService.search(query.text);
  }

  @Post('/save-to-vector-store')
  savePageOrDatabseToVectorStore(
    @Body() body: NotionSaveToVectorStoreParamsDto
  ) {
    return this.notionService.savePageOrDatabseToVectorStore(body);
  }
}
