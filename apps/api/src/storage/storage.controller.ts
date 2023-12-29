import { Controller, Get } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}
  // Nest controller get route method
  @Get() getStorage() {
    return this.storageService.getFile('upload/something2.pdf');
  }
}
