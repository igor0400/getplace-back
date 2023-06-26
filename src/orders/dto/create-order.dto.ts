import { OrderTypes } from '../types/order-types';

export class CreateOrderDto {
  readonly type: OrderTypes;
}
