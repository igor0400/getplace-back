import { Module } from '@nestjs/common';
import { BonusesService } from './bonuses.service';
import { UserBonusesRepository } from './repositories/user-bonuses.repository';
import { DatabaseModule } from 'src/common';
import { UserBonuses } from './models/user-bonuses.model';

@Module({
  imports: [DatabaseModule.forFeature([UserBonuses])],
  providers: [BonusesService, UserBonusesRepository],
  exports: [BonusesService],
})
export class BonusesModule {}
