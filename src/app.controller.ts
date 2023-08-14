import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guard/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @UseGuards(AuthGuard)
  @Get()
  getHello(): string {
    return 'Hello';
  }

  @Get('db-host-from-config')
  getDatabaseHostFromConfigService(): string {
    // return process.env.DATABASE_HOST; // local
    return this.configService.get('DATABASE_HOST'); // local
  }
}
