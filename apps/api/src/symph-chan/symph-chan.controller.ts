import { Controller, Get } from '@nestjs/common';
import { SymphChanService } from './symph-chan.service';

@Controller('symph-chan')
export class SymphChanController {
  constructor(private readonly symphChanService: SymphChanService) {}

  @Get()
  query() {
    return this.symphChanService.query();
  }
}
