import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractModel } from './abstract.model';
import { ModelCtor } from 'sequelize-typescript';
import { getUId } from './assets/getUId';
import { DestroyOptions, FindOptions, FindOrCreateOptions } from 'sequelize';

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

  async findOne(options: FindOptions) {
    const document = await this.model.findOne(options);

    if (!document) {
      this.logger.warn('Document not found with FindOptions', options);
      throw new NotFoundException('Document not found.');
    }

    return document as TModel;
  }

  async findByPk(id: string, options?: Omit<FindOptions<any>, 'where'>) {
    const document = await this.model.findByPk(id, options);

    return document as TModel;
  }

  async findAll(options: FindOptions) {
    const documents = await this.model.findAll(options);

    return documents as TModel[];
  }

  async findOrCreate(options: FindOrCreateOptions) {
    const documents = await this.model.findOrCreate(options);

    return documents[0] as TModel;
  }

  async destroy(options: DestroyOptions) {
    const deletedCount = await this.model.destroy(options);

    return deletedCount;
  }
}
