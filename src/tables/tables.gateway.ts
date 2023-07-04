import { Req, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { TablesService } from './tables.service';
import { Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/common';
import { ChangeTableStatusDto } from './dto/change-table-status.dto';
import { ChangeReservationDto } from '../reservations/dto/change-reservation.dto';
import { CreateReservationOrderDishDto } from 'src/orders/dto/create-reservation-order-dish.dto';
import { DeleteReservationOrderDishDto } from 'src/orders/dto/delete-reservation-order-dish.dto';
import { OrdersService } from 'src/orders/orders.service';
import { CreateReservationDto } from 'src/reservations/dto/create-reservation.dto';
import { ReservationsService } from 'src/reservations/reservations.service';
import { InviteReservationUserDto } from 'src/reservations/dto/invite-reservation-user.dto';
import { ReplyReservationInviteDto } from 'src/reservations/dto/reply-reservation-invite.dto';
import { CreateTableReservationUserSeatDto } from 'src/reservations/dto/create-reservation-user-seat.dto';

@WebSocketGateway(9090, {
  namespace: 'tables',
  cors: {
    credentials: true,
    origin: '*',
  },
})
export class TablesGateway {
  constructor(
    private readonly tablesService: TablesService,
    private readonly ordersService: OrdersService,
    private readonly reservationsService: ReservationsService,
  ) {}

  @WebSocketServer()
  private server: Server;

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
    const reservation = await this.reservationsService.createReservation({
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
  async changeReservation(
    @MessageBody() dto: ChangeReservationDto,
    @Req() req: CustomReq,
  ) {
    const reservation = await this.reservationsService.changeReservation({
      ...dto,
      userId: req.user.sub,
    });

    this.server.emit('onChangeReservation', {
      msg: 'Изменение брони',
      content: reservation,
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('cancelReservation')
  async cancelReservation(
    @MessageBody() dto: ChangeReservationDto,
    @Req() req: CustomReq,
  ) {
    const reservation = await this.reservationsService.cancelReservation({
      ...dto,
      userId: req.user.sub,
    });

    this.server.emit('onCancelReservation', {
      msg: 'Отмена брони',
      content: reservation,
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('inviteUser')
  async inviteReservationUser(
    @MessageBody() dto: InviteReservationUserDto,
    @Req() req: CustomReq,
  ) {
    const invite = await this.reservationsService.createReservationUserInvite({
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
    const invite = await this.reservationsService.replyToReservationUserInvite({
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

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createReservationDish')
  async createReservationDish(
    @MessageBody() dto: CreateReservationOrderDishDto,
    @Req() req: CustomReq,
  ) {
    const dish = await this.ordersService.createReservationOrderDish({
      ...dto,
      userId: req.user.sub,
    });

    this.server.emit('onCreateReservationDish', {
      msg: 'Пользователь добавил блюдо',
      content: dish,
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteReservationDish')
  async deleteReservationDish(
    @MessageBody() dto: DeleteReservationOrderDishDto,
    @Req() req: CustomReq,
  ) {
    const deleteInfo = await this.ordersService.deleteReservationOrderDishById({
      ...dto,
      userId: req.user.sub,
    });

    if (deleteInfo) {
      this.server.emit('onDeleteReservationDish', {
        msg: 'Пользователь удалил блюдо',
        content: deleteInfo,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createReservationUserSeat')
  async createReservationUserSeat(
    @MessageBody() dto: CreateTableReservationUserSeatDto,
    @Req() req: CustomReq,
  ) {
    const seat = await this.reservationsService.createReservationUserSeat({
      ...dto,
      userId: req.user.sub,
    });

    this.server.emit('onСreateReservationUserSeat', {
      msg: 'Пользователь создал место',
      content: seat,
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteReservationUserSeat')
  async deleteReservationUserSeat(
    @MessageBody() dto: CreateTableReservationUserSeatDto,
    @Req() req: CustomReq,
  ) {
    const deleteInfo = await this.reservationsService.deleteReservationUserSeat(
      {
        ...dto,
        userId: req.user.sub,
      },
    );

    if (deleteInfo) {
      this.server.emit('onDeleteReservationUserSeat', {
        msg: 'Пользователь удалил место',
        content: deleteInfo,
      });
    }
  }
}
