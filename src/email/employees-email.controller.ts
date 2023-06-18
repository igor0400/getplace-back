import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CustomReq } from 'src/libs/common';
import { EmailVerifyDto } from './dto/email-verify.dto';
import { EmployeesEmailService } from './employees-email.service';
import { ApiBearerAuth, ApiDefaultResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Email сотрудников')
@Controller('email/employees')
export class EmployeesEmailController {
  constructor(private emailService: EmployeesEmailService) {}

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
    description: 'Стандартная отправка кода',
  })
  @ApiBearerAuth('Bearer token')
  @UseGuards(JwtAuthGuard)
  @Post('default')
  default(@Req() req: CustomReq) {
    return this.emailService.sendDefaultCode(req.user.sub);
  }
}
