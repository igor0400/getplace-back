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
  @Get('places/guests')
  getAllPalcesGuests(
    @Query('period') period: Periods,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Req() req: CustomReq,
  ) {
    return this.statsService.getAllPalcesGuests({
      period,
      employeeId: req.user.sub,
      limit: +limit,
      offset: +offset,
    });
  }
}
