import { Module, forwardRef } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailConfig } from './configs/mail.config';
import { JwtModule } from '@nestjs/jwt';
import { UsersEmailController } from './users-email.controller';
import { EmployeesEmailController } from './employees-email.controller';
import { UsersEmailService } from './users-email.service';
import { EmployeesEmailService } from './employees-email.service';
import { RedisCacheModule } from '../redis/redis.module';
import { UsersModule } from '../users/users.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  controllers: [UsersEmailController, EmployeesEmailController],
  providers: [UsersEmailService, EmployeesEmailService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailConfig,
    }),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    forwardRef(() => RedisCacheModule),
    forwardRef(() => UsersModule),
    forwardRef(() => EmployeesModule),
  ],
  exports: [UsersEmailService, EmployeesEmailService],
})
export class EmailModule {}
