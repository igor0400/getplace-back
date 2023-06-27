import { Module, forwardRef } from '@nestjs/common';
import { ReferalsService } from './referals.service';
import { DatabaseModule } from 'src/common';
import { ReferalsController } from './referals.controller';
import { Referals } from './models/referal.model';
import { ReferalInviters } from './models/inviters.model';
import { ReferalInvitedUsers } from './models/invited-users.model';
import { UsersModule } from '../users/users.module';
import { ReferalsInvitedUsersRepository } from './repositories/invited-users.repository';
import { ReferalsRepository } from './repositories/referals.repository';
import { ReferalsInvitersRepository } from './repositories/inviters.repository';

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
