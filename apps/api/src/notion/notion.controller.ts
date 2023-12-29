import { Controller, Get, Inject, Query } from '@nestjs/common';
import { NotionService } from './notion.service';
import { NOTION_APP } from '../common/constants';
import { NotionSearchParamsDto } from './dto/notion-search-params.dto';

@Controller('notion')
export class NotionController {
  constructor(
    @Inject(NOTION_APP) private readonly notionService: NotionService
  ) {}

  @Get('/search')
  search(@Query() query: NotionSearchParamsDto) {
    return this.notionService.search(query.text);
  }
}
