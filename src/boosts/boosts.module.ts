import { Module } from '@nestjs/common';
import { BoostsService } from './boosts.service';
import { BoostsController } from './boosts.controller';
import { DatabaseModule } from 'src/common';
import { Boost } from './models/boost.model';
import { PlaceBoosts } from './models/place-boosts.model';
import { BoostRepository } from './repositories/boost.repository';
import { PlaceBoostsRepository } from './repositories/place-boosts.repository';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Boost, PlaceBoosts]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    EmployeesModule,
  ],
  controllers: [BoostsController],
  providers: [BoostsService, BoostRepository, PlaceBoostsRepository],
  exports: [BoostsService, PlaceBoostsRepository],
})
export class BoostsModule {}
