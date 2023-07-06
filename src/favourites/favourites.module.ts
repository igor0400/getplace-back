import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { DatabaseModule } from 'src/common';
import { UserFavouritePlace } from './models/user-favourite-place.model';
import { UserFavouritePlaceRepository } from './repositories/user-favourite-place.repository';
import { FavouritesController } from './favourites.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule.forFeature([UserFavouritePlace]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
  ],
  providers: [FavouritesService, UserFavouritePlaceRepository],
  controllers: [FavouritesController],
})
export class FavouritesModule {}
