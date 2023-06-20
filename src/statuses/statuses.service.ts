import { Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { StatusRepository } from './repositories/statuses.repository';

@Injectable()
export class StatusesService {
  constructor(private readonly statusRepository: StatusRepository) {}

  async getAllStatuses() {
    const statuses = await this.statusRepository.findAll({
      include: { all: true },
    });
    return statuses;
  }

  async getStatusById(id: string) {
    const status = await this.statusRepository.findOne({
      where: { id },
    });
    return status;
  }

  async getStatusByValue(value: string) {
    const status = await this.statusRepository.findOne({ where: { value } });
    return status;
  }

  async createStatus(dto: CreateStatusDto) {
    const status = await this.statusRepository.create(dto);
    return status;
  }

  async findOrCreateStatus(dto: CreateStatusDto) {
    const status = await this.getStatusByValue(dto.value);

    if (status) return status;

    const newStatus = await this.createStatus(dto);
    return newStatus;
  }

  async changeStatus(dto: ChangeStatusDto) {
    const status = await this.statusRepository.findOne({
      where: { id: dto.statusId },
    });

    for (let key in dto) {
      if (status[key]) {
        status[key] = dto[key];
      }
    }

    return status.save();
  }
}
