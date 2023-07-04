import { Module, forwardRef } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomRepository } from './repositories/room.repository';
import { TablesModule } from 'src/tables/tables.module';
import { Room } from './models/room.model';
import { DatabaseModule } from 'src/common';
import { EmployeesModule } from 'src/employees/employees.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule.forFeature([Room]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    forwardRef(() => TablesModule),
    EmployeesModule,
  ],
  providers: [RoomsService, RoomRepository],
  controllers: [RoomsController],
  exports: [RoomsService],
})
export class RoomsModule {}
