import { Module, forwardRef } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { TableReservationRepository } from './repositories/reservation.repository';
import { TableReservationUserRepository } from './repositories/reservation-user.repository';
import { TableReservationInviteRepository } from './repositories/reservation-invite.repository';
import { DatabaseModule } from 'src/common';
import { Table } from 'src/tables/models/table.model';
import { TableReservation } from './model/table-reservation.model';
import { TableReservationUser } from './model/table-reservation-user.model';
import { TableReservationInvite } from './model/table-reservation-invite.model';
import { SeatsModule } from 'src/seats/seats.module';
import { PlacesModule } from 'src/places/places.module';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  imports: [
    DatabaseModule.forFeature([
      Table,
      TableReservation,
      TableReservationUser,
      TableReservationInvite,
    ]),
    forwardRef(() => SeatsModule),
    forwardRef(() => StatsModule),
    forwardRef(() => PlacesModule),
  ],
  providers: [
    ReservationsService,
    TableReservationRepository,
    TableReservationUserRepository,
    TableReservationInviteRepository,
  ],
  exports: [
    ReservationsService,
    TableReservationRepository,
    TableReservationUserRepository,
  ],
})
export class ReservationsModule {}