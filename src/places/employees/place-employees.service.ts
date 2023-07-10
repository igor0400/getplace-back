import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Employee } from 'src/employees/models/employee.model';
import { Role } from 'src/roles/models/roles.model';
import { PlaceEmployeesRepository } from '../repositories/employees.repository';
import { EmployeePlaceRolesRepository } from 'src/roles/repositories/employee-place-roles.repository';
import { RolesService } from 'src/roles/roles.service';
import { EmployeesService } from 'src/employees/employees.service';
import { CreatePlaceEmployeeDto } from './dto/create-place-employee.dto';
import { ChangePlaceEmployeeDto } from './dto/change-place-employee.dto';

const employeesInclude = [Role, Employee];

@Injectable()
export class PlaceEmployeesService {
  constructor(
    private readonly placeEmployeesRepository: PlaceEmployeesRepository,
    private readonly employeePlaceRolesRepository: EmployeePlaceRolesRepository,
    private readonly rolesService: RolesService,
    private readonly employeesService: EmployeesService,
  ) {}

  async getAllEmployees(placeId: string, limit: number, offset: number) {
    const employees = await this.placeEmployeesRepository.findAll({
      offset: offset || 0,
      limit: limit || 10,
      include: employeesInclude,
      where: {
        placeId,
      },
    });

    return employees;
  }

  async getPlaceEmployeeById(id: string) {
    const employee = await this.placeEmployeesRepository.findByPk(id, {
      include: employeesInclude,
    });

    return employee;
  }

  async addPlaceEmployeeRole(placeEmployeeId: string, value: string) {
    const role = await this.rolesService.getRoleByValue(value);

    if (!role) {
      throw new HttpException('Роль не найдена', HttpStatus.BAD_REQUEST);
    }

    return this.employeePlaceRolesRepository.create({
      placeEmployeeId,
      roleId: role.id,
    });
  }

  async createEmployee(dto: CreatePlaceEmployeeDto) {
    const { placeId, employeeEmail, title, roles } = dto;

    const employee = await this.employeesService.getEmployeeByEmail(
      employeeEmail,
    );

    if (!employee) {
      throw new NotFoundException(
        `Сотрудник с email: ${employeeEmail}, не найден. Возможно он еще не зарегестрировался.`,
      );
    }

    const isCreated = await this.isEmployeeCreated(employeeEmail, placeId);

    if (isCreated) {
      throw new BadRequestException(
        `Сотрудник с email: ${employeeEmail} уже существует`,
      );
    }

    const placeEmployee = await this.placeEmployeesRepository.create({
      placeId,
      employeeId: employee.id,
      title,
    });

    for (let roleValue of roles) {
      await this.addPlaceEmployeeRole(placeEmployee.id, roleValue);
    }

    return this.getPlaceEmployeeById(placeEmployee.id);
  }

  async changeEmployee(dto: ChangePlaceEmployeeDto) {
    const { placeEmployeeId, title, roles } = dto;

    const placeEmployee = await this.getPlaceEmployeeById(placeEmployeeId);

    if (!placeEmployee) {
      throw new NotFoundException('Сотрудник не найден');
    }

    if (roles) {
      await this.employeePlaceRolesRepository.destroy({
        where: {
          placeEmployeeId,
        },
      });
      for (let roleValue of roles) {
        await this.addPlaceEmployeeRole(placeEmployee.id, roleValue);
      }
    }

    if (title) {
      placeEmployee.title = title;
      placeEmployee.save();
    }

    return this.getPlaceEmployeeById(placeEmployee.id);
  }

  async deleteEmployee(placeEmployeeId: string) {
    const deleteCount = await this.placeEmployeesRepository.destroy({
      where: { id: placeEmployeeId },
    });

    await this.employeePlaceRolesRepository.destroy({
      where: {
        placeEmployeeId,
      },
    });

    return deleteCount;
  }

  async isEmployeeCreated(email: string, placeId: string) {
    const employee = await this.employeesService.getEmployeeByEmail(email);
    const placeEmployee = await this.placeEmployeesRepository.findOne({
      where: {
        employeeId: employee.id,
        placeId,
      },
    });

    if (placeEmployee) return true;

    return false;
  }
}
