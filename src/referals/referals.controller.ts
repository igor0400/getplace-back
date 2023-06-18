import { Body, Controller, Post } from '@nestjs/common';
import { ReferalsService } from './referals.service';

@Controller('referals')
export class ReferalsController {
  constructor(private referalsService: ReferalsService) {}
}
