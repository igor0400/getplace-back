import { WebSocketGateway } from '@nestjs/websockets';
import { OrdersService } from './orders.service';

@WebSocketGateway()
export class OrdersGateway {
  constructor(private readonly ordersService: OrdersService) {}
}
