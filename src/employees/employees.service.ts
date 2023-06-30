import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { hash, compare } from 'bcryptjs';
import { AddRoleDto } from './dto/add-role.dto';
import { ChangeEmployeeDto } from './dto/change-employee.dto';
import { Op } from 'sequelize';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Role } from '../roles/models/roles.model';
import { PlaceEmployees } from '../places/models/employees.model';
import { EmployeeSession } from '../sessions/models/employee-session.model';
import { EmployeesRepository } from './repositories/employees.repository';
import { EmployeeRolesRepository } from '../roles/repositories/employee-roles.repository';
import { EmployeeSessionRepository } from '../sessions/repositories/employee-session.repository';
import { RolesService } from '../roles/roles.service';
import { EmployeesEmailService } from '../email/employees-email.service';
import { Employee } from './models/employee.model';
import { Place } from 'src/places/models/place.model';

export const employeesInclude = [
  Role,
  EmployeeSession,
  { model: PlaceEmployees, include: [Role, Place] },
];

@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeeRepository: EmployeesRepository,
    private readonly employeeRolesRepository: EmployeeRolesRepository,
    private readonly employeeSessionRepository: EmployeeSessionRepository,
    private roleService: RolesService,
    private emailService: EmployeesEmailService,
  ) {}

  async getAllEmployees(limit: number, offset: number, search: string = '') {
    const employees = await this.employeeRepository.findAll({
      offset: offset || 0,
      limit: limit || 20,
      include: employeesInclude,
      where: {
        email: {
          [Op.like]: `%${search}%`,
        },
      },
    });

    return employees;
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      include: employeesInclude,
    });

    return employee;
  }

  async getEmployeeByEmail(email: string) {
    const employee = await this.employeeRepository.findOne({
      where: { email },
      include: employeesInclude,
    });

    return employee;
  }

  async createEmployee(employeeDto: CreateEmployeeDto) {
    const password = await hash(employeeDto.password, 10);

    const employee = await this.employeeRepository.create({
      ...employeeDto,
      password,
    });

    await this.addRole({ value: 'USER', employeeId: employee.id });

    return employee;
  }

  async deleteEmployeeById(id: string) {
    const deletedCount = await this.employeeRepository.destroy({
      where: { id },
    });

    return deletedCount;
  }

  async addRole(dto: AddRoleDto) {
    const employee = await this.employeeRepository.findByPk(dto.employeeId);
    const role = await this.roleService.getRoleByValue(dto.value);

    if (role && employee) {
      const employeeRole = {
        employeeId: dto.employeeId,
        roleId: role.id,
      };
      await this.employeeRolesRepository.create(employeeRole);
      return employeeRole;
    }

    throw new HttpException(
      'Пользователь или роль не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async changeEmployee(dto: ChangeEmployeeDto) {
    const { verifyCode, employeeId } = dto;
    const verify = await this.emailService.checkVerifyCode(
      employeeId.toString(),
      verifyCode,
    );

    if (!verify) {
      throw new HttpException(
        'Неправильный код подтверждения, возможно он устарел',
        HttpStatus.BAD_REQUEST,
      );
    }

    const employee = await this.employeeRepository.findByPk(employeeId);

    if (!employee) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    for (let key in dto) {
      if (employee[key] !== undefined) {
        employee[key] = dto[key];
      }
    }

    return employee.save();
  }

  async changePassword(dto: ChangePasswordDto) {
    const { employeeId, verifyCode, newPassword, oldPassword } = dto;
    const verify = await this.emailService.checkVerifyCode(
      employeeId.toString(),
      verifyCode,
    );

    if (!verify) {
      throw new HttpException(
        'Неправильный код подтверждения, возможно он устарел',
        HttpStatus.BAD_REQUEST,
      );
    }

    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
      include: employeesInclude,
    });

    const valid = await compare(oldPassword, employee.password);

    if (!valid) {
      throw new HttpException(
        'Неверно введен текущий пароль',
        HttpStatus.BAD_REQUEST,
      );
    }

    const password = await hash(newPassword, 10);

    employee.password = password;

    await this.employeeSessionRepository.destroy({ where: { employeeId } });

    return employee.save();
  }
}
