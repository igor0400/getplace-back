import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
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
    await this.checkFileSize(file.size);

    const fileName = this.getNewFileName(file.originalname);
    const fileData = await this.storageService.upload(fileName, file.buffer);

    const fileModel = await this.fileRepository.create({
      name: file.originalname,
      storageName: fileName,
      src: `${process.env.BACKET_URL}/${fileName}`,
      size: file.size,
    });

    return {
      file: fileModel,
      storageData: fileData,
    };
  }

  async createImage(file: Express.Multer.File) {
    await this.checkImageFormat(file.mimetype);
    await this.checkFileSize(file.size);

    const fileName = this.getNewFileName(file.originalname);
    const fileData = await this.storageService.upload(fileName, file.buffer);

    const fileModel = await this.fileRepository.create({
      name: file.originalname,
      storageName: fileName,
      src: `${process.env.BACKET_URL}/${fileName}`,
      size: file.size,
    });

    return {
      file: fileModel,
      storageData: fileData,
    };
  }

  async deleteFile(fileId: string) {
    const file = await this.fileRepository.findByPk(fileId);

    if (!file) {
      throw new NotFoundException('Файл не найден');
    }

    await this.storageService.delete(file.storageName);
    const deleteCount = await this.fileRepository.destroy({
      where: {
        id: fileId,
      },
    });

    return deleteCount;
  }

  private getNewFileName(fileName: string) {
    const fileSplit = fileName.split('.');
    const fileType = fileSplit[fileSplit.length - 1];

    return `${uuid()}-${uuid()}.${fileType}`;
  }

  private checkFileSize(fileSize: number) {
    const maxSize = +process.env.FILES_MAX_SIZE_IN_MB * 1024 * 1024 * 8;

    if (fileSize > maxSize) {
      throw new HttpException(
        `Размер файла превышает ${process.env.FILES_MAX_SIZE_IN_MB}МБ`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private checkImageFormat(imageType: string) {
    const validFormats = [
      'jpg',
      'jpeg',
      'JPEG 2000',
      'jp2',
      'svg',
      'png',
      'gif',
      'webp',
      'bmp',
      'tiff',
      'tif',
    ];

    let isValid = false;

    for (let type of validFormats) {
      if (imageType.includes(type)) {
        isValid = true;
      }
    }

    if (!isValid) {
      throw new HttpException(
        'Данный формат изображения не поддерживается',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
