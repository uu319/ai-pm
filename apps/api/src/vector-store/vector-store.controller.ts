import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VectorStoreService } from './vector-store.service';
import { Express } from 'express';
import { GetQueryParamsDto } from './dto/get-query-params.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('vector-store')
export class VectorStoreController {
  constructor(private readonly vectorStoreService: VectorStoreService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    this.vectorStoreService.save(file);
  }

  @UseGuards(AuthGuard)
  @Get()
  query(@Query() queryString: GetQueryParamsDto) {
    return this.vectorStoreService.queryFromEmbeding(queryString.text);
  }
}
