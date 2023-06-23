import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room, RoomCreationArgs } from '../models/room.model';

@Injectable()
export class RoomRepository extends AbstractRepository<Room, RoomCreationArgs> {
  protected readonly logger = new Logger(Room.name);

  constructor(
    @InjectModel(Room)
    private roomModel: typeof Room,
  ) {
    super(roomModel);
  }
}
