import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VectorStoreService } from './vector-store.service';
import { Express } from 'express';

@Controller('vector-store')
export class VectorStoreController {
  constructor(private readonly vectorStoreService: VectorStoreService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    this.vectorStoreService.saveUsingPdfLoader(file);
  }

  @Get('/checker')
  checker() {
    return this.vectorStoreService.checker();
  }
}
