import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ReferalsRepository } from './repositories/referals.repository';
import { ReferalsInvitersRepository } from './repositories/inviters.repository';
import { ReferalsInvitedUsersRepository } from './repositories/invited-users.repository';
import { User } from '../users/models/user.model';

@Injectable()
export class ReferalsService {
  constructor(
    private readonly referalsRepository: ReferalsRepository,
    private readonly referalInvitersRepository: ReferalsInvitersRepository,
    private readonly referalInvitedUsersRepository: ReferalsInvitedUsersRepository,
    private usersService: UsersService,
  ) {}

  async createUserReferals(inviterCode: string, userId: string) {
    const inviter = await this.usersService.getUserByReferalCode(inviterCode);
    const inviterId = inviter.id;

    const userReferals = await this.referalsRepository.create({ userId });
    await this.referalInvitersRepository.create({
      referalId: userReferals.id,
      userId: inviterId,
    });

    await this.incUserReferalProcent(inviterId, 3);

    const inviterReferals = await this.findOrCreateReferals({
      where: { userId: inviterId },
      include: [{ model: User, as: 'inviter' }],
    });

    await this.referalInvitedUsersRepository.create({
      referalId: inviterReferals.id,
      userId,
    });

    if (inviterReferals?.inviter?.length) {
      const inviter2 = inviterReferals?.inviter[0];
      await this.incUserReferalProcent(inviter2.id, 2);

      const inviter2Referals = await this.referalsRepository.findOne({
        where: { userId: inviter2.id },
        include: [{ model: User, as: 'inviter' }],
      });

      if (inviter2Referals?.inviter?.length) {
        const inviter3 = inviter2Referals?.inviter[0];
        await this.incUserReferalProcent(inviter3.id, 1);
      }
    }

    return true;
  }

  async findOrCreateReferals(dto: { where: any; include?: any[] }) {
    const referals = await this.referalsRepository.findOne(dto);

    if (referals) return referals;

    const newReferals = await this.referalsRepository.create(dto.where);
    return newReferals;
  }

  async incUserReferalProcent(userId: string, value: number) {
    const referals = await this.findOrCreateReferals({
      where: { userId },
    });

    referals.referalProcent += value;
    return referals.save();
  }
}
