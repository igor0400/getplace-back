import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { SeatsService } from './seats.service';

@WebSocketGateway()
export class SeatsGateway {
  constructor(private readonly seatsService: SeatsService) {}
}
