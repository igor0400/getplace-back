import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractModel } from './abstract.model';
import { ModelCtor } from 'sequelize-typescript';
import { getUId } from './assets/getUId';
import {
  DestroyOptions,
  FindOptions,
  FindOrCreateOptions,
  UpdateOptions,
} from 'sequelize';

export abstract class AbstractRepository<
  TModel extends AbstractModel,
  TModelCreation extends {} = TModel,
> {
  protected abstract readonly logger: Logger;
  protected model: ModelCtor;

  constructor(model: ModelCtor) {
    this.model = model;
  }

  async create(document: Omit<TModelCreation, 'id'>): Promise<TModel> {
    const createdDocument = await this.model.create({
      ...document,
      id: getUId(),
    });

    if (!document) {
      this.logger.warn('Document not created with Options', document);
      throw new NotFoundException('Document not created.');
    }

    return createdDocument as TModel;
  }

  async findOne(options: FindOptions<TModel>) {
    const document = await this.model.findOne(options);

    return document as TModel;
  }

  async findByPk(id: string, options?: Omit<FindOptions<TModel>, 'where'>) {
    const document = await this.model.findByPk(id, options);

    return document as TModel;
  }

  async findAll(options: FindOptions<TModel>) {
    const documents = await this.model.findAll(options);

    return documents as TModel[];
  }

  async findOrCreate(options: FindOrCreateOptions<TModel, TModelCreation>) {
    const documents = await this.model.findOrCreate(options);

    return documents[0] as TModel;
  }

  async destroy(options: DestroyOptions<TModel>) {
    const deletedCount = await this.model.destroy(options);

    return deletedCount;
  }

  async update(
    values: TModel,
    options: Omit<UpdateOptions<TModel>, 'returning'>,
  ) {
    const affectedCount = await this.model.update(values, options);

    return affectedCount;
  }
}
