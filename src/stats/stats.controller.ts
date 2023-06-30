import { Controller, UseGuards, Get, Query, Req } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Periods } from './types/periods';
import { periods } from './configs/periods';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/common';

@ApiTags('Статистика (только с Bearer токеном)')
@ApiSecurity('Bearer only')
@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @ApiQuery({
    name: 'period',
    description: 'Период',
    required: false,
    enum: periods,
  })
  @Get('places/guests')
  getAllPalcesGuests(@Query('period') period: Periods, @Req() req: CustomReq) {
    return this.statsService.getAllPalcesGuests(period, req.user.sub);
  }

  // адаптировать статистику под большое кол-во данных
  // средний чек
  // общая сумма заказов
  // периоды: день, неделя, месяц, год, все время
  // сделать сравнение статистики в процентах
  // график посещаемости
  // самые продаваемые позиции, по дням (при кродаже записывать в отдельную табличку)
}
