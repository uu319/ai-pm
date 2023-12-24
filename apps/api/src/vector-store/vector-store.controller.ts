import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VectorStoreService } from './vector-store.service';
import { Express } from 'express';
import { GetQueryParamsDto } from './dto/get-query-params.dto';

@Controller('vector-store')
export class VectorStoreController {
  constructor(private readonly vectorStoreService: VectorStoreService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  processFile(@UploadedFile() file: Express.Multer.File) {
    this.vectorStoreService.processFile(file);
  }

  @Get()
  query(@Query() queryString: GetQueryParamsDto) {
    return this.vectorStoreService.queryFromEmbeding(queryString.text);
  }
}
