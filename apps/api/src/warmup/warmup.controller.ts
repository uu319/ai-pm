import { Controller, Get } from '@nestjs/common';

@Controller('/_ah/warmup')
export class WarmupController {
  @Get()
  warmup() {
    return 'Warmup successful!';
  }
}
