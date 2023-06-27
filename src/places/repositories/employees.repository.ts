import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  PlaceEmployees,
  PlaceEmployeesCreationArgs,
} from '../models/employees.model';

@Injectable()
export class PlaceEmployeesRepository extends AbstractRepository<
  PlaceEmployees,
  PlaceEmployeesCreationArgs
> {
  protected readonly logger = new Logger(PlaceEmployees.name);

  constructor(
    @InjectModel(PlaceEmployees)
    private placeEmployeesModel: typeof PlaceEmployees,
  ) {
    super(placeEmployeesModel);
  }
}
