import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { TableReservation } from './reservation.model';
import { User } from 'src/users/models/user.model';

export interface TableReservationInviteCreationArgs {
  reservationId: string;
  inviterId: string;
  friendId: string;
}

@Table({ tableName: 'table_reservation_invites', updatedAt: false })
export class TableReservationInvite extends AbstractModel<
  TableReservationInvite,
  TableReservationInviteCreationArgs
> {
  @ForeignKey(() => TableReservation)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reservationId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  inviterId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  friendId: string;

  @BelongsTo(() => User, 'inviterId')
  inviterData: User;

  @BelongsTo(() => User, 'friendId')
  friendData: User;
}
