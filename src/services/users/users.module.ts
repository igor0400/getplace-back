import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories';
import { DatabaseModule } from 'src/libs/common';
import { User } from './models/user.model';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  imports: [
    DatabaseModule.forFeature([User]),
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule),
    forwardRef(() => EmailModule),
    SessionsModule,
  ],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
