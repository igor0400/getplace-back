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
import { TableReservationDto } from './dto/table-reservation.dto';
import { CustomReq } from 'src/libs/common';
import { ApiTags } from '@nestjs/swagger';

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

  // сделать статусы и создание
  // сделать подтверждение бронирования
  // сделать одновременную бронь 10сек (сохранять id стола и брони и время в redis)
  // сделать миграции
  // сделать изменение статуса стола
  // сделать приглашение пользователя за стол

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('tableReservation')
  async createTableReservation(
    @MessageBody() dto: TableReservationDto,
    @Req() req: CustomReq,
  ) {
    const reservation = await this.tablesService.createTableReservation({
      ...dto,
      userId: req.user.sub,
    });

    this.server.emit('onTableReservation', {
      msg: 'Новое бронирование',
      content: reservation,
    });
  }
}
