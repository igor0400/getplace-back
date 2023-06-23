import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { TablesService } from './tables.service';

@WebSocketGateway()
export class TablesGateway {
  constructor(private readonly tablesService: TablesService) {}
}
