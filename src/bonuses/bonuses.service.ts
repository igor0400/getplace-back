import { Injectable } from '@nestjs/common';
import { UserBonusesRepository } from './repositories/user-bonuses.repository';
import { AddUserBonusesBalanceDto } from './dto/add-user-bonuses-balance.dto';

@Injectable()
export class BonusesService {
  constructor(private readonly userBonusesRepository: UserBonusesRepository) {}

  async addUserBonusesBalance(dto: AddUserBonusesBalanceDto) {
    const { userId, amount } = dto;
    const userBonuses = await this.userBonusesRepository.findOrCreate({
      where: {
        userId,
      },
    });

    userBonuses.internalBalance = String(
      +userBonuses.internalBalance + +amount,
    );
    return userBonuses.save();
  }
}
