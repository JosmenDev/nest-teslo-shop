import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { Role } from 'src/auth/enums/role.enum';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(Role.user)
  executeSeed() {
    console.log('Hola Seed');
    return this.seedService.runSeed();
  }
}
