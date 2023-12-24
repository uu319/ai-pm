import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import '@nestjs/axios';

@ApiTags('Healths')
@Controller('health')
export class HealthcheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    // Sample Only. Revise this to actual things needed to check in the API.
    return this.health.check([
      () =>
        this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
