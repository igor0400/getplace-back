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
import { ChangeReservationDto } from './dto/change-reservation.dto';
import { InviteReservationUserDto } from './dto/invite-reservation-user.dto';
import { ReplyReservationInviteDto } from './dto/reply-reservation-invite.dto';

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

  // сделать заказ стола, и добавлять туда блюда, может каждый пользователь из reservationUsers
  // сделать сиденья
  // сделать оплату, общий чек и возможность его разделить и тд

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

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('changeReservation')
  async changeReservationStatus(
    @MessageBody() dto: ChangeReservationDto,
    @Req() req: CustomReq,
  ) {
    const reservation = await this.tablesService.changeReservation({
      ...dto,
      userId: req.user.sub,
    });

    this.server.emit('onChangeReservation', {
      msg: 'Изменение брони',
      content: reservation,
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('inviteUser')
  async inviteReservationUser(
    @MessageBody() dto: InviteReservationUserDto,
    @Req() req: CustomReq,
  ) {
    const invite = await this.tablesService.createReservationUserInvite({
      ...dto,
      inviterId: req.user.sub,
    });

    this.server.emit('onInviteUser', {
      msg: 'Приглашение пользователя',
      content: invite,
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('replyToInvite')
  async replyToReservationInvite(
    @MessageBody() dto: ReplyReservationInviteDto,
    @Req() req: CustomReq,
  ) {
    const invite = await this.tablesService.replyToReservationUserInvite({
      ...dto,
      userId: req.user.sub,
    });

    if (dto.solution === 'accept') {
      this.server.emit('onAcceptInvite', {
        msg: 'Пользователь принял приглашение',
        content: invite,
      });
    } else {
      this.server.emit('onRejectInvite', {
        msg: 'Пользователь отклонил приглашение',
        content: invite,
      });
    }
  }
}
