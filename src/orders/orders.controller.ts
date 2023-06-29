import { Controller, Get, Query, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiDefaultResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Заказы')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiDefaultResponse({ description: 'Получение всех заказов' })
  @ApiQuery({
    name: 'limit',
    description: 'Ограничение колличества',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Отступ от начала',
    required: false,
  })
  @Get()
  getAllOrders(@Query('limit') limit: string, @Query('offset') offset: string) {
    return this.ordersService.getAllOrders(+limit, +offset);
  }

  @ApiDefaultResponse({
    description: 'Получение заказа по id',
  })
  @ApiParam({
    name: 'id',
    description: 'id заказа',
  })
  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }
}
