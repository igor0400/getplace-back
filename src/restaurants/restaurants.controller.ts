import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Рестораны (заведения)')
@Controller('restaurants')
export class RestaurantsController {
  createDish() {
    
  }
}
