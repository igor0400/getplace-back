import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { RolesRepository } from './repositories/roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RolesRepository) {}
  async getAllRoles() {
    const roles = await this.roleRepository.findAll({
      include: { all: true },
    });
    return roles;
  }

  async getRoleById(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });
    return role;
  }

  async getRoleByValue(value: string) {
    const role = await this.roleRepository.findOne({ where: { value } });
    return role;
  }

  async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepository.create(dto);
    return role;
  }

  async findOrCreateRole(dto: CreateRoleDto) {
    const role = await this.getRoleByValue(dto.value);

    if (role) return role;

    const newRole = await this.createRole(dto);
    return newRole;
  }

  async changeRole(dto: ChangeRoleDto) {
    const role = await this.roleRepository.findOne({
      where: { id: dto.roleId },
    });

    for (let key in dto) {
      if (role[key]) {
        role[key] = dto[key];
      }
    }

    return role.save();
  }
}
