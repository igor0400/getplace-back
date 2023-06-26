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
import { ChangeTableStatusDto } from './dto/change-table-status.dto';
import { ChangeReservationDto } from './dto/change-reservation.dto';
import { InviteReservationUserDto } from './dto/invite-reservation-user.dto';
import { ReplyReservationInviteDto } from './dto/reply-reservation-invite.dto';
import { CreateReservationOrderDishDto } from 'src/orders/dto/create-reservation-order-dish.dto';
import { ChangeReservationOrderDishDto } from 'src/orders/dto/change-reservation-order-dish.dto';
import { DeleteReservationOrderDishDto } from 'src/orders/dto/delete-reservation-order-dish.dto';
import { OrdersService } from 'src/orders/orders.service';
import { CreateTableReservationUserSeatDto } from './dto/create-reservation-user-seat.dto';

@WebSocketGateway(9090, { namespace: 'tables' })
export class TablesGateway {
  constructor(
    private readonly tablesService: TablesService,
    private readonly ordersService: OrdersService,
  ) {}

  @WebSocketServer()
  private server: Server;

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
  @SubscribeMessage('changeReservationDish')
  async changeReservationDish(
    @MessageBody() dto: ChangeReservationOrderDishDto,
    @Req() req: CustomReq,
  ) {
    const dish = await this.ordersService.changeReservationOrderDish({
      ...dto,
      userId: req.user.sub,
    });

    this.server.emit('onChangeReservationDish', {
      msg: 'Пользователь изменил блюдо',
      content: dish,
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('deleteReservationDish')
  async deleteReservationDish(
    @MessageBody() dto: DeleteReservationOrderDishDto,
    @Req() req: CustomReq,
  ) {
    const deleteInfo = await this.ordersService.changeReservationOrderDish({
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
    const seat = await this.tablesService.createReservationUserSeat({
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
    const deleteInfo = await this.tablesService.deleteReservationUserSeat({
      ...dto,
      userId: req.user.sub,
    });

    if (deleteInfo) {
      this.server.emit('onDeleteReservationUserSeat', {
        msg: 'Пользователь удалил место',
        content: deleteInfo,
      });
    }
  }
}
