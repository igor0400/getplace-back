import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CustomReq } from 'src/common';
import { EmailVerifyDto } from './dto/email-verify.dto';
import { UsersEmailService } from './users-email.service';
import { ApiBearerAuth, ApiDefaultResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('Email пользователей')
@Controller('email/users')
export class UsersEmailController {
  constructor(
    private readonly emailService: UsersEmailService,
    private readonly usersService: UsersService,
  ) {}

  @ApiDefaultResponse({
    description: 'Отправка кода при регистрации',
  })
  @Post('verify')
  verifyEmail(@Body() dto: EmailVerifyDto) {
    return this.emailService.sendVerifyCode(dto.email);
  }

  @ApiDefaultResponse({
    description: 'Отправка кода для смены пароля (только с Bearer токеном)',
  })
  @ApiBearerAuth('Bearer token')
  @UseGuards(JwtAuthGuard)
  @Post('change-pass')
  changePass(@Req() req: CustomReq) {
    return this.emailService.sendChangePassCode(req.user.sub);
  }

  @ApiDefaultResponse({
    description: 'Отправка кода для смены пароля',
  })
  @Post('change-pass-without-auth')
  async changePassWithoutAuth(@Body() dto: ChangePasswordDto) {
    const user = await this.usersService.getUserByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('Пользователь с таким email не найден');
    }

    return this.emailService.sendChangePassCode(user.id);
  }

  @ApiDefaultResponse({
    description: 'Стандартная отправка кода',
  })
  @ApiBearerAuth('Bearer token')
  @UseGuards(JwtAuthGuard)
  @Post('default')
  default(@Req() req: CustomReq) {
    return this.emailService.sendDefaultCode(req.user.sub);
  }
}
