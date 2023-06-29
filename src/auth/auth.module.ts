import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EmployeesAuthService } from './employees-auth.service';
import { EmployeesTokensService } from './employees-tokens.service';
import { EmployeesAuthController } from './employees-auth.controller';
import { UsersAuthController } from './users-auth.controller';
import { UsersAuthService } from './users-auth.service';
import { UsersTokensService } from './users-tokens.service';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import { EmailModule } from '../email/email.module';
import { RolesModule } from '../roles/roles.module';
import { ReferalsModule } from '../referals/referals.module';

@Module({
  controllers: [EmployeesAuthController, UsersAuthController],
  providers: [
    EmployeesAuthService,
    EmployeesTokensService,
    UsersAuthService,
    UsersTokensService,
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/.${process.env.NODE_ENV}.env`,
    }),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    forwardRef(() => EmployeesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => SessionsModule),
    forwardRef(() => EmailModule),
    forwardRef(() => RolesModule),
    forwardRef(() => ReferalsModule),
  ],
  exports: [
    EmployeesAuthService,
    EmployeesTokensService,
    UsersAuthService,
    UsersTokensService,
    JwtModule,
  ],
})
export class AuthModule {}
