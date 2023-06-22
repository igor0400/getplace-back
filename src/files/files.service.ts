import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { FileRepository } from './repositories/file.repository';
import { v4 as uuid } from 'uuid';
import { Op } from 'sequelize';

@Injectable()
export class FilesService {
  constructor(
    private readonly storageService: StorageService,
    private readonly fileRepository: FileRepository,
  ) {}

  async getAllFiles(limit: number, offset: number, search: string = '') {
    return this.fileRepository.findAll({
      offset: offset || 0,
      limit: limit || 20,
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
      order: ['id'],
    });
  }

  async createFile(file: Express.Multer.File) {
    const fileName = `${uuid()}-${file.originalname}`;
    const fileData = await this.storageService.upload(fileName, file.buffer);

    const fileModel = await this.fileRepository.create({
      name: file.originalname,
      src: `${process.env.BACKET_URL}/${fileName}`,
      size: file.size,
    });

    return {
      file: fileModel,
      storageData: fileData,
    };
  }
}
