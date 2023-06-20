import { Module } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';
import { UserStatusesRepository } from './repositories/user-statuses.repository';
import { StatusRepository } from './repositories/statuses.repository';

@Module({
  controllers: [StatusesController],
  providers: [StatusesService, UserStatusesRepository, StatusRepository],
  exports: [StatusesService, UserStatusesRepository],
})
export class StatusesModule {}
