import { Module, forwardRef } from '@nestjs/common';
import { ReferalsService } from './referals.service';
import {
  ReferalsInvitedUsersRepository,
  ReferalsInvitersRepository,
  ReferalsRepository,
} from './repositories';
import { DatabaseModule } from 'src/libs/common';
import { ReferalsController } from './referals.controller';
import { Referals } from './models/referal.model';
import { ReferalInviters } from './models/inviters.model';
import { ReferalInvitedUsers } from './models/invited-users.model';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [
    ReferalsService,
    ReferalsInvitedUsersRepository,
    ReferalsRepository,
    ReferalsInvitersRepository,
  ],
  imports: [
    DatabaseModule.forFeature([Referals, ReferalInviters, ReferalInvitedUsers]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ReferalsController],
  exports: [ReferalsService],
})
export class ReferalsModule {}
