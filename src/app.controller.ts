import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get('db-host-from-config')
  getDatabaseHostFromConfigService(): string {
    // return process.env.DATABASE_HOST; // local
    return this.configService.get('DATABASE_HOST'); // local
  }
}
