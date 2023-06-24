import { OnModuleInit, Req, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { TablesService } from './tables.service';
import { Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CustomReq } from 'src/libs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangeTableStatusDto } from './dto/change-table-status.dto';

@ApiTags('Бронь столов')
@WebSocketGateway(9090, { namespace: 'tables' })
export class TablesGateway implements OnModuleInit {
  constructor(private readonly tablesService: TablesService) {}

  @WebSocketServer()
  private server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  // сделать миграции (всё что связано с reservations)
  // сделать изменение статуса стола
  // сделать приглашение пользователя за стол
  // сделать заказ блюд за стол
  // сделать оплату, общий чек и тд

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('changeTableState')
  async changeTableState(@MessageBody() dto: ChangeTableStatusDto) {
    await this.tablesService.changeTable({
      ...dto,
      placeId: 'id',
    });

    this.server.emit('onChangeTableState', {
      msg: 'Изменение состояния стола',
      content: dto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createReservation')
  async createReservation(
    @MessageBody() dto: CreateReservationDto,
    @Req() req: CustomReq,
  ) {
    const reservation = await this.tablesService.createReservation({
      ...dto,
      userId: req.user.sub,
    });

    this.server.emit('onCreateReservation', {
      msg: 'Новое бронирование',
      content: reservation,
    });
  }
}
