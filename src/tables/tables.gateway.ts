import { Req, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { TablesService } from './tables.service';
import { Server } from 'socket.io';
import { SocketsJwtAuthGuard } from 'src/auth/guards/sockets-jwt-auth.guard';
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
import { CancelReservationDto } from 'src/reservations/dto/cancel-reservation.dto';
import { PayReservationOrderDto } from 'src/payments/dto/pay-reservation-order.dto';

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

  @UseGuards(SocketsJwtAuthGuard)
  @SubscribeMessage('changeTableState')
  async changeTableState(
    @MessageBody() dto: ChangeTableStatusDto,
    @Req() req: CustomReq,
  ) {
    if (req?.error)
      return this.sendError('onChangeTableStateError', req?.error);

    try {
      await this.tablesService.changeTable({
        ...dto,
        placeId: 'id',
      });

      this.server.emit('onChangeTableState', {
        message: 'Изменение состояния стола',
        content: dto,
      });
    } catch (e) {
      this.sendError('onChangeTableStateError', e?.message);
    }
  }

  @UseGuards(SocketsJwtAuthGuard)
  @SubscribeMessage('createReservation')
  async createReservation(
    @MessageBody() dto: CreateReservationDto,
    @Req() req: CustomReq,
  ) {
    if (req?.error)
      return this.sendError('onCreateReservationError', req?.error);

    try {
      const reservation = await this.reservationsService.createReservation({
        ...dto,
        userId: req.user.sub,
      });

      this.server.emit('onCreateReservation', {
        message: 'Новое бронирование',
        content: reservation,
      });
    } catch (e) {
      this.sendError('onCreateReservationError', e?.message);
    }
  }

  @UseGuards(SocketsJwtAuthGuard)
  @SubscribeMessage('changeReservation')
  async changeReservation(
    @MessageBody() dto: ChangeReservationDto,
    @Req() req: CustomReq,
  ) {
    if (req?.error)
      return this.sendError('onChangeReservationError', req?.error);

    try {
      const reservation = await this.reservationsService.changeReservation({
        ...dto,
        userId: req.user.sub,
      });

      this.server.emit('onChangeReservation', {
        message: 'Изменение брони',
        content: reservation,
      });
    } catch (e) {
      this.sendError('onChangeReservationError', e?.message);
    }
  }

  @UseGuards(SocketsJwtAuthGuard)
  @SubscribeMessage('cancelReservation')
  async cancelReservation(
    @MessageBody() dto: CancelReservationDto,
    @Req() req: CustomReq,
  ) {
    if (req?.error)
      return this.sendError('onCancelReservationError', req?.error);

    try {
      const reservation = await this.reservationsService.cancelReservation({
        ...dto,
        userId: req.user.sub,
      });

      this.server.emit('onCancelReservation', {
        message: 'Отмена брони',
        content: reservation,
      });
    } catch (e) {
      this.sendError('onCancelReservationError', e?.message);
    }
  }

  @UseGuards(SocketsJwtAuthGuard)
  @SubscribeMessage('inviteUser')
  async inviteReservationUser(
    @MessageBody() dto: InviteReservationUserDto,
    @Req() req: CustomReq,
  ) {
    if (req?.error) return this.sendError('onInviteUserError', req?.error);

    try {
      const invite = await this.reservationsService.createReservationUserInvite(
        {
          ...dto,
          inviterId: req.user.sub,
        },
      );

      this.server.emit('onInviteUser', {
        message: 'Приглашение пользователя',
        content: invite,
      });
    } catch (e) {
      this.sendError('onInviteUserError', e?.message);
    }
  }

  @UseGuards(SocketsJwtAuthGuard)
  @SubscribeMessage('replyToInvite')
  async replyToReservationInvite(
    @MessageBody() dto: ReplyReservationInviteDto,
    @Req() req: CustomReq,
  ) {
    if (req?.error) return this.sendError('onReplyToInviteError', req?.error);

    try {
      const invite =
        await this.reservationsService.replyToReservationUserInvite({
          ...dto,
          userId: req.user.sub,
        });

      if (dto.solution === 'accept') {
        this.server.emit('onAcceptInvite', {
          message: 'Пользователь принял приглашение',
          content: invite,
        });
      } else {
        this.server.emit('onRejectInvite', {
          message: 'Пользователь отклонил приглашение',
          content: invite,
        });
      }
    } catch (e) {
      this.sendError('onReplyToInviteError', e?.message);
    }
  }

  @UseGuards(SocketsJwtAuthGuard)
  @SubscribeMessage('createReservationDish')
  async createReservationDish(
    @MessageBody() dto: CreateReservationOrderDishDto,
    @Req() req: CustomReq,
  ) {
    if (req?.error)
      return this.sendError('onCreateReservationDishError', req?.error);

    try {
      const dish = await this.ordersService.createReservationOrderDish({
        ...dto,
        userId: req.user.sub,
      });

      this.server.emit('onCreateReservationDish', {
        message: 'Пользователь добавил блюдо',
        content: dish,
      });
    } catch (e) {
      this.sendError('onCreateReservationDishError', e?.message);
    }
  }

  @UseGuards(SocketsJwtAuthGuard)
  @SubscribeMessage('deleteReservationDish')
  async deleteReservationDish(
    @MessageBody() dto: DeleteReservationOrderDishDto,
    @Req() req: CustomReq,
  ) {
    if (req?.error)
      return this.sendError('onDeleteReservationDishError', req?.error);

    try {
      const deleteInfo =
        await this.ordersService.deleteReservationOrderDishById({
          ...dto,
          userId: req.user.sub,
        });

      if (deleteInfo) {
        this.server.emit('onDeleteReservationDish', {
          message: 'Пользователь удалил блюдо',
          content: deleteInfo,
        });
      }
    } catch (e) {
      this.sendError('onDeleteReservationDishError', e?.message);
    }
  }

  @UseGuards(SocketsJwtAuthGuard)
  @SubscribeMessage('createReservationUserSeat')
  async createReservationUserSeat(
    @MessageBody() dto: CreateTableReservationUserSeatDto,
    @Req() req: CustomReq,
  ) {
    if (req?.error)
      return this.sendError('onСreateReservationUserSeatError', req?.error);

    try {
      const seat = await this.reservationsService.createReservationUserSeat({
        ...dto,
        userId: req.user.sub,
      });

      this.server.emit('onСreateReservationUserSeat', {
        message: 'Пользователь создал место',
        content: seat,
      });
    } catch (e) {
      this.sendError('onСreateReservationUserSeatError', e.message);
    }
  }

  @UseGuards(SocketsJwtAuthGuard)
  @SubscribeMessage('deleteReservationUserSeat')
  async deleteReservationUserSeat(
    @MessageBody() dto: CreateTableReservationUserSeatDto,
    @Req() req: CustomReq,
  ) {
    if (req?.error)
      return this.sendError('onDeleteReservationUserSeatError', req?.error);

    try {
      const deleteInfo =
        await this.reservationsService.deleteReservationUserSeat({
          ...dto,
          userId: req.user.sub,
        });

      if (deleteInfo) {
        this.server.emit('onDeleteReservationUserSeat', {
          message: 'Пользователь удалил место',
          content: deleteInfo,
        });
      }
    } catch (e) {
      this.sendError('onDeleteReservationUserSeatError', e?.message);
    }
  }

  @UseGuards(SocketsJwtAuthGuard)
  @SubscribeMessage('payReservationOrder')
  async payReservationOrder(
    @MessageBody() dto: PayReservationOrderDto,
    @Req() req: CustomReq,
  ) {
    if (req?.error)
      return this.sendError('onPayReservationOrderError', req?.error);

    try {
      const orderPayment = await this.ordersService.payReservationOrder({
        ...dto,
        userId: req.user.sub,
      });

      if (orderPayment) {
        this.server.emit('onPayReservationOrder', {
          message: 'Заказ брони оплачен',
          content: orderPayment,
        });
      }
    } catch (e) {
      this.sendError('onPayReservationOrderError', e?.message);
    }
  }

  private sendError(
    eventName: string,
    errorMessage: string,
    content: any | undefined = {},
  ) {
    this.server.emit(eventName, {
      message: errorMessage,
      content,
    });
  }
}
